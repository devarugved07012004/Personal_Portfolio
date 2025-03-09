(function () {
    // Original section navigation code
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();

document.addEventListener("DOMContentLoaded", function() {
    // Get all sections and controls
    const sections = ["home", "about", "portfolio", "blogs", "contact"];
    const controls = document.querySelectorAll(".control");
    
    // Variables to control scroll behavior
    let isScrolling = false;
    let currentSectionIndex = 0;
    let scrollThreshold = 100; // Pixels from section end to trigger next section
    let scrollCooldown = false;
    
    // Function to activate a specific section
    function activateSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        // Update the current section index
        currentSectionIndex = index;
        
        // Get the section to activate
        const sectionId = sections[index];
        const sectionElement = document.getElementById(sectionId);
        
        // Get the control button
        const controlButton = document.querySelector(`.control[data-id="${sectionId}"]`);
        
        // Only proceed if elements exist
        if (sectionElement && controlButton) {
            // Remove active class from current active elements
            document.querySelector(".active-btn").classList.remove("active-btn");
            document.querySelector(".active").classList.remove("active");
            
            // Add active class to new elements
            controlButton.classList.add("active-btn");
            sectionElement.classList.add("active");
            
            // Scroll to the section (with smooth behavior)
            sectionElement.scrollIntoView({ behavior: "smooth" });
            
            // Set cooldown to prevent multiple section changes
            scrollCooldown = true;
            setTimeout(() => {
                scrollCooldown = false;
            }, 1000); // 1-second cooldown
        }
    }
    
    // Function to handle wheel events for section navigation
    function handleWheel(event) {
        if (scrollCooldown) return;
        
        // Determine scroll direction
        const direction = event.deltaY > 0 ? 1 : -1;
        
        // Calculate the bottom position of the current section
        const currentSection = document.getElementById(sections[currentSectionIndex]);
        const currentSectionRect = currentSection.getBoundingClientRect();
        
        // If scrolling down and near the bottom of current section
        if (direction > 0 && 
            currentSectionRect.bottom <= window.innerHeight + scrollThreshold && 
            currentSectionIndex < sections.length - 1) {
            event.preventDefault();
            activateSection(currentSectionIndex + 1);
        }
        // If scrolling up and near the top of current section
        else if (direction < 0 && 
                currentSectionRect.top >= -scrollThreshold && 
                currentSectionIndex > 0) {
            event.preventDefault();
            activateSection(currentSectionIndex - 1);
        }
    }
    
    // Function to handle keyboard navigation (arrow keys)
    function handleKeyDown(event) {
        if (scrollCooldown) return;
        
        // Down or Right arrow
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            if (currentSectionIndex < sections.length - 1) {
                event.preventDefault();
                activateSection(currentSectionIndex + 1);
            }
        }
        // Up or Left arrow
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            if (currentSectionIndex > 0) {
                event.preventDefault();
                activateSection(currentSectionIndex - 1);
            }
        }
    }
    
    // Detect scroll events to navigate between sections
    window.addEventListener("wheel", handleWheel, { passive: false });
    
    // Add keyboard navigation support
    window.addEventListener("keydown", handleKeyDown);
    
    // Update control buttons to use our activateSection function
    controls.forEach((control, index) => {
        control.addEventListener("click", function() {
            activateSection(index);
        });
    });
    
    // Create a scroll indicator
    const scrollIndicator = document.createElement("div");
    scrollIndicator.className = "scroll-indicator";
    
    // Create indicator dots
    sections.forEach((section, index) => {
        const dot = document.createElement("div");
        dot.className = "indicator-dot";
        if (index === 0) dot.classList.add("active");
        
        // Add click event to navigate to section
        dot.addEventListener("click", () => {
            activateSection(index);
        });
        
        scrollIndicator.appendChild(dot);
    });
    
    // Add the scroll indicator to the body
    document.body.appendChild(scrollIndicator);
    
    // Add styles for scroll indicator
    const style = document.createElement("style");
    style.innerHTML = `
        .scroll-indicator {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        }
        
        .indicator-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: var(--color-grey-5);
            cursor: pointer;
            transition: all 0.3s ease-in-out;
        }
        
        .indicator-dot.active {
            background-color: var(--color-secondary);
            transform: scale(1.3);
        }
    `;
    document.head.appendChild(style);
    
    // Function to update the active dot in the scroll indicator
    function updateScrollIndicator() {
        const dots = document.querySelectorAll(".indicator-dot");
        dots.forEach((dot, index) => {
            if (index === currentSectionIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }
    
    // Add observer to update the scroll indicator based on active section
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const sectionIndex = sections.indexOf(sectionId);
                if (sectionIndex !== -1) {
                    currentSectionIndex = sectionIndex;
                    updateScrollIndicator();
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all sections
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            sectionObserver.observe(section);
        }
    });
});