import anime from 'animejs';
import TransitionUtilities from './animOpenPostUtilities';

export default class Animations extends TransitionUtilities {
  /* eslint object-shorthand: "warn" */

  // Compound animation functions
  explodeBricks() {
    this.blackBg();
    this.ripple();
    this.brickSplosion();
  }

  implodeBricks() {
    this.removeAnimation(this.animBg);
    this.removeAnimation(this.animBrick);
    this.animBg.revert();
    this.animBrick.revert();
    this.animations.push(this.animBrick, this.animBg);
  }

  explodeDecorative() {
    this.ripple();
    this.particles();
  }

  cloudExpand(newText) {
    this.cloudTextChange(newText);
    this.cloudScale();
  }

  cloudRetract() {
    this.cloudTextChange();
    this.removeAnimation(this.animScale);
    this.animScale.revert();
    this.animations.push(this.animScale);
  }

  // Animations for brick explosion / load
  brickSplosion() {
    this.bricks = document.querySelectorAll('.brick, .mortar');
    const targetR = this.eventInfo.targetR;
    this.animBrick = anime({
      targets: this.bricks,
      // Here is our problem area, below
      translateX(el) {
        if ($(el).is('.brick')) return anime.random(targetR, -targetR) * 3;
        return 0;
      },
      translateY(el) {
        if ($(el).is('.brick')) return anime.random(targetR * 1.15, -targetR * 1.15) * 3;
        return '100vw';
      },
      rotate(el) {
        if ($(el).is('.brick')) return anime.random(200, 500);
        return 0;
      },
      duration: 2000,
      delay: 150,
      easing: 'easeOutCubic',
      begin: this.resetAndPrime('article', 'transitions', 0, 0),
      complete: this.resetAndPrime('article', 0, 'transitions'),
    });
    this.animations.push(this.animBrick);
  }

  blackBg() {
    this.pageFill = new this.Circle({
      x: this.eventInfo.pageX,
      y: this.eventInfo.pageY,
      r: 0,
      fill: this.color.next,
    });
    this.animBg = anime({
      targets: this.pageFill,
      r: this.eventInfo.targetR,
      duration: Math.max(this.eventInfo.targetR / 2, this.eventInfo.minCoverDuration),
      easing: 'easeInCubic',
    });
    this.animations.push(this.animBg);
  }

  ripple() {
    this.ripple = new this.Circle({
      x: this.eventInfo.pageX,
      y: this.eventInfo.pageY,
      r: 0,
      fill: this.color.current,
      opacity: 1,
    });
    this.animRipple = anime({
      targets: this.ripple,
      r: this.eventInfo.rippleSize,
      opacity: {
        value: 0,
        delay: 200,
        duration: 500,
      },
      easing: 'easeOutExpo',
      duration: 700,
      complete: this.removeAnimation(this.animRipple),
    });
    this.animations.push(this.animRipple);
  }

  particles() {
    this.particles = [];
    for (let i = 0; i < 20; i += 1) {
      const particle = new this.Circle({
        x: this.eventInfo.pageX,
        y: this.eventInfo.pageY,
        fill: this.color.current,
        r: anime.random(10, 20),
      });
      this.particles.push(particle);
    }
    this.animParticles = anime({
      targets: this.particles,
      x(particle) {
        return particle.x + anime.random(this.eventInfo.rippleSize, -this.eventInfo.rippleSize);
      },
      y(particle) {
        return particle.y + anime.random(this.eventInfo.rippleSize, -this.eventInfo.rippleSize);
      },
      r: {
        value: 0,
        delay: 400,
        duration: 400,
        easing: 'easeOutCubic',
      },
      easing: 'easeInOutQuart',
      duration: anime.random(600, 800),
      complete: this.removeAnimation(this.animParticles),
    });
    this.animations.push(this.animParticles);
  }

  // Changes to the cloud
  cloudScale() {
    this.animScale = anime({
      targets: this.$cloud[0],
      scale: 0.85,
      'min-width': '120%',
      duration: 1000,
      delay: 400,
      easing: 'easeInOutQuad',
      complete: function () {
        this.removeAnimation(this.animCloudScale);
        if (this.$cloudLink.html() !== this.originalCloudText) {
          this.$main.addClass('invisible hidden'); // MOVE TO PROPER PLACE
        }
        this.$clone.removeClass('invisible');
      }.bind(this),
    });
    this.animations.push(this.animScale);
  }

  cloudTextChange(newLink = this.originalCloudText) {
    this.animHideChange = anime({
      targets: this.$cloudLink[0],
      opacity: 0,
      easing: 'easeOutQuint',
      duration: 1000,
      complete: function () {
        this.$clone.removeClass('invisible');
        this.$cloudLink.html(newLink); // MOVE TO PROPER PLACE
        this.cloudTextVisible();
        this.removeAnimation(this.animHideChange);
      }.bind(this),
    });
    this.animations.push(this.animHideChange);
  }

  cloudTextVisible() {
    this.animCloudVis = anime({
      targets: this.$cloudLink[0],
      opacity: 1,
      easing: 'easeInQuad',
      duration: 1000,
      delay: 100,
      complete: this.removeAnimation(this.animCloudVis),
    });
    this.animations.push(this.animCloudVis);
  }

  // Utility functions, included here to limit the calling of animejs
  animate() {
    anime({
      duration: Infinity,
      update: () => {
        this.cxt.clearRect(0, 0, this.cW, this.cH);
        this.animations.forEach((anim) => {
          anim.animatables.forEach((animatable) => {
            if (typeof animatable.target.draw !== 'undefined') animatable.target.draw(this.cxt);
          });
        });
      },
    });
  }

  removeAnimation(animation) {
    const index = () => this.animations.indexOf(animation);
    if (index > -1) this.animations.splice(index, 1);
  }
}
