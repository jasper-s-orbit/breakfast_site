gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
});

gsap.set('iframe',{
    scale:2.3,
})


gsap.to('iframe',{
    scale:1.3,
      duration: 3,
  ease: "power3.out",
})

gsap.to('main',{
    opacity:1,
    delay:3,
    duration:3,
})

const scroll = gsap.timeline(
    {
  scrollTrigger: {
    trigger: ".scrollssss",
    scrub: 2,
    // pin: true,
    start: "top top",
    end: "+=1000",
    ease: "none",
  },
})
scroll.set(".hero", { visibility: "visible" });
scroll.to('.main',{
    opacity: 0,
    duration: 0.5,
    stagger:true,
  },
   )
scroll.to('.hero',{
    opacity:0,
    duration:1.2,
    delay:0.3,
}, '<')
scroll.set(".white", { visibility: "visible" });
scroll.to('white',{
    opacity:1,
})
if (window.innerWidth >= 768) {
  // Your .grid/.grid1 horizontal scroll code here
  scroll.to('.grid',{
     x: () => -(document.querySelector(".grid").scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".white",
    pin: true,
    scrub: 1,
    end: () => "+=" + (document.querySelector(".grid").scrollWidth - window.innerWidth)
  }
})

scroll.to('.grid1',{
   x: () => (document.querySelector(".grid1").scrollWidth - window.innerWidth), // move right
  ease: "none",
  scrollTrigger: {
    trigger: ".white1",
    pin: true,
    scrub: 1,
    start: "top top",
    end: () => "+=" + (document.querySelector(".grid1").scrollWidth - window.innerWidth)
  }
})
}
scroll.set('.placesorder',{
    scale:0.6,
})
scroll.fromTo('.placesorder',{
    scale:0.8,
    duration:0.9,
    ease:'power1.out'
},{
    scale:1.1,
    duration:0.9,

    ease:'power1.out'
}, '<')

