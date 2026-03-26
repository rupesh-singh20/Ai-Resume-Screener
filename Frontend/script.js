class ResumeScreener {
  constructor() {
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.jobDescription = document.getElementById("jobDescription");
    this.resumeFiles = document.getElementById("resumeFiles");
    this.screenBtn = document.getElementById("screenBtn");
    this.fileCount = document.getElementById("fileCount");
    this.loading = document.getElementById("loading");
    this.results = document.getElementById("results");
    this.totalResumes = document.getElementById("totalResumes");
    this.topScore = document.getElementById("topScore");
    this.topCandidates = document.getElementById("topCandidates");
    this.allCandidates = document.getElementById("allCandidates");
    
    // Modal elements
    this.resumeModal = document.getElementById("resumeModal");
    this.modalCandidateName = document.getElementById("modalCandidateName");
    this.modalCandidateScore = document.getElementById("modalCandidateScore");
    this.modalCandidateFile = document.getElementById("modalCandidateFile");
    this.modalResumeText = document.getElementById("modalResumeText");
    this.closeModalBtn = document.getElementById("closeModalBtn");
  }

  bindEvents() {
    // Modal close events
    this.closeModalBtn.addEventListener('click', () => this.closeResumeModal());
    this.resumeModal.addEventListener('click', (e) => {
      if (e.target === this.resumeModal) this.closeResumeModal();
    });
    console.log("Binding events...");
    this.resumeFiles.addEventListener("change", () => {
      console.log("File change detected");
      this.updateFileCount();
    });
    this.jobDescription.addEventListener("input", () =>
      this.toggleScreenButton(),
    );
    this.screenBtn.addEventListener("click", (e) => {
      console.log("Screen button clicked");
      e.preventDefault(); // Prevent any form submission
      this.screenResumes();
    });
  }

  updateFileCount() {
    const files = this.resumeFiles.files;
    const count = files.length;

    // Validate file types
    const validFiles = [];
    const invalidFiles = [];

    for (let file of files) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".pdf") ||
        fileName.endsWith(".docx") ||
        fileName.endsWith(".doc")
      ) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    }

    if (invalidFiles.length > 0) {
      alert(
        `Invalid file types detected: ${invalidFiles.join(", ")}\n\nPlease only upload PDF or DOCX files.`,
      );
      this.resumeFiles.value = ""; // Clear the file input
      this.fileCount.textContent = "No files selected";
      this.toggleScreenButton();
      return;
    }

    this.fileCount.textContent =
      count === 0
        ? "No files selected"
        : `${count} file${count > 1 ? "s" : ""} selected`;
    this.toggleScreenButton();
  }

  toggleScreenButton() {
    const hasFiles = this.resumeFiles.files.length > 0;
    const hasDescription = this.jobDescription.value.trim().length > 0;
    this.screenBtn.disabled = !(hasFiles && hasDescription);
  }

  async screenResumes() {
    console.log("screenResumes function called");
    const files = this.resumeFiles.files;
    const jobDescription = this.jobDescription.value.trim();

    console.log(
      "Files:",
      files.length,
      "Job description length:",
      jobDescription.length,
    );

    if (!files.length || !jobDescription) {
      console.log("Missing files or job description");
      return;
    }

    // Show loading
    this.loading.classList.remove("hidden");
    this.results.classList.add("hidden");

    // Update loading message
    const loadingText = this.loading.querySelector("p");
    loadingText.textContent = `Analyzing ${files.length} resume${files.length > 1 ? "s" : ""} with AI...`;

    try {
      console.log("Making API request...");
      // Test health
      try {
        const healthResponse = await fetch("/health");
        const healthData = await healthResponse.json();
        console.log("Health response:", healthData);
      } catch (error) {
        console.error("Health fetch failed:", error);
        alert(
          "Backend not reachable. Check if backend is running on port 5000.",
        );
        return;
      }

      const formData = new FormData();
      for (let file of files) {
        formData.append("resumes", file);
        console.log("Added file:", file.name);
      }
      formData.append("job_description", jobDescription);
      console.log("Job description:", jobDescription.substring(0, 50) + "...");

      const response = await fetch("/upload_resumes", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      this.displayResults(data);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      this.loading.classList.add("hidden");
    }
  }

  openResumeModal(candidate) {
    this.modalCandidateName.textContent = candidate.name;
    this.modalCandidateScore.textContent = `Score: ${candidate.ats_score}`;
    this.modalCandidateFile.textContent = candidate.filename || "Unknown File";
    this.modalResumeText.textContent = candidate.resume_text || "Resume text not available.";
    
    this.resumeModal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // prevent app background scrolling
  }

  closeResumeModal() {
    this.resumeModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  displayResults(data) {
    this.totalResumes.textContent = data.total;
    this.topScore.textContent =
      data.best_candidates.length > 0 ? data.best_candidates[0].ats_score : 0;

    // Check if there's a reason for unknown fit
    if (data.results.length > 0 && data.results[0].ai_fit === "UNKNOWN") {
      alert(
        data.results[0].reason +
          "\n\nThe app is using keyword-based scoring only.",
      );
    }

    // Display top candidates
    this.topCandidates.innerHTML = "";
    data.best_candidates.forEach((candidate, index) => {
      const card = this.createCandidateCard(candidate, index + 1);
      this.topCandidates.appendChild(card);
    });

    // Display all candidates
    this.allCandidates.innerHTML = "";
    data.results.forEach((candidate) => {
      const row = this.createCandidateRow(candidate);
      this.allCandidates.appendChild(row);
    });

    this.results.classList.remove("hidden");
  }

  createCandidateCard(candidate, rank) {
    const card = document.createElement("div");
    card.className = "candidate-card";

    card.innerHTML = `
            <div class="candidate-rank">#${rank}</div>
            <div class="candidate-name">${candidate.name}</div>
            <div class="candidate-score">${candidate.ats_score}</div>
            <div class="candidate-contact">
                <span>📧 ${candidate.email}</span>
                <span>📞 ${candidate.phone}</span>
            </div>
            <div class="score-breakdown">
                <div class="score-item">
                    <strong>Fit:</strong> ${candidate.ai_fit}
                </div>
                <div class="score-item">
                    <strong>Reason:</strong> ${candidate.reason}
                </div>
            </div>
            <button class="view-resume-btn">📄 View Resume</button>
        `;

    card.querySelector('.view-resume-btn').addEventListener('click', () => {
        this.openResumeModal(candidate);
    });

    return card;
  }

  createCandidateRow(candidate) {
    const row = document.createElement("div");
    row.className = "candidate-row";

    row.innerHTML = `
            <div>
                <strong>${candidate.name}</strong>
                <div style="color: #6b7280; font-size: 14px;">
                    📧 ${candidate.email} | 📞 ${candidate.phone}
                </div>
            </div>
            <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
                <div style="font-size: 24px; font-weight: bold; color: #10b981;">
                    ${candidate.ats_score}
                </div>
                <div style="font-size: 12px; color: #6b7280;">
                    Fit: ${candidate.ai_fit}
                </div>
                <button class="view-resume-btn" style="padding: 4px 8px; margin-top: 5px; width: auto; font-size: 12px;">📄 View</button>
            </div>
        `;

    row.querySelector('.view-resume-btn').addEventListener('click', () => {
        this.openResumeModal(candidate);
    });

    return row;
  }
}

// Initialize the app
new ResumeScreener();
