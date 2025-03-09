(function () {
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
    const sections = ["home", "about", "portfolio", "blogs", "contact"];
    const controls = document.querySelectorAll(".control");
    
    let isScrolling = false;
    let currentSectionIndex = 0;
    let scrollThreshold = 100; // Pixels from section end to trigger next section
    let scrollCooldown = false;
    
    function activateSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        currentSectionIndex = index;
        
        const sectionId = sections[index];
        const sectionElement = document.getElementById(sectionId);
        
        const controlButton = document.querySelector(`.control[data-id="${sectionId}"]`);
        
        if (sectionElement && controlButton) {
            document.querySelector(".active-btn").classList.remove("active-btn");
            document.querySelector(".active").classList.remove("active");
            
            controlButton.classList.add("active-btn");
            sectionElement.classList.add("active");
            
            sectionElement.scrollIntoView({ behavior: "smooth" });
            
            scrollCooldown = true;
            setTimeout(() => {
                scrollCooldown = false;
            }, 1000); // 1-second cooldown
        }
    }
    
    function handleWheel(event) {
        if (scrollCooldown) return;
        
        const direction = event.deltaY > 0 ? 1 : -1;
        
        const currentSection = document.getElementById(sections[currentSectionIndex]);
        const currentSectionRect = currentSection.getBoundingClientRect();
        
        if (direction > 0 && 
            currentSectionRect.bottom <= window.innerHeight + scrollThreshold && 
            currentSectionIndex < sections.length - 1) {
            event.preventDefault();
            activateSection(currentSectionIndex + 1);
        }
        else if (direction < 0 && 
                currentSectionRect.top >= -scrollThreshold && 
                currentSectionIndex > 0) {
            event.preventDefault();
            activateSection(currentSectionIndex - 1);
        }
    }
    
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
    
    window.addEventListener("wheel", handleWheel, { passive: false });
    
    window.addEventListener("keydown", handleKeyDown);
    
    controls.forEach((control, index) => {
        control.addEventListener("click", function() {
            activateSection(index);
        });
    });
    
    const scrollIndicator = document.createElement("div");
    scrollIndicator.className = "scroll-indicator";
    
    sections.forEach((section, index) => {
        const dot = document.createElement("div");
        dot.className = "indicator-dot";
        if (index === 0) dot.classList.add("active");
        
        dot.addEventListener("click", () => {
            activateSection(index);
        });
        
        scrollIndicator.appendChild(dot);
    });
    
    document.body.appendChild(scrollIndicator);
    
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
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            sectionObserver.observe(section);
        }
    });
});