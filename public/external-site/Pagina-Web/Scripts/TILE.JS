document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas-estrellas");
    const ctx = canvas.getContext("2d");
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let particulas = [];
    const totalParticulas = 1300;
  
    class Particula {
      constructor() {
        this.reset();
      }
  
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 80; 
        this.size = Math.random() * 5 + 1.8; 
        this.speedY = Math.random() * 2 + 1.5;
        this.speedX = (Math.random() - 0.5) * 2.5;
        this.opacity = Math.random() * 0.5 + 0.5;
      }
  
      update() {
        this.x += this.speedX;
        this.y -= this.speedY;
        this.opacity -= 0.004;
  
        if (this.y < 0 || this.opacity <= 0) {
          this.reset();
        }
      }
  
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }
  
    function crearParticulas() {
      for (let i = 0; i < totalParticulas; i++) {
        particulas.push(new Particula());
      }
    }
  
    function animar() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particulas.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animar);
    }
  
    crearParticulas();
    animar();
  });
  