import Logger from '../util/logger';
import Animations from './animOpenPostAnimations';

export default class PageTransitions extends Animations {
  eventToggle(event, eventTarget) {
    if ($(eventTarget).is('.closePost')) {
      event.preventDefault();
      this.closePost();
    } else if (this.cloneCheck) {
      Logger.log('begin', 'the post opener');
      event.preventDefault();
      this.openPost();
      Logger.log();
    } else {
      alert('something else');
    }
  }

  openPost() {
    const $brick = this.eventInfo.newPage;
    this.grabContent($brick);
    const cloudText = this.$clone.find('.magicLink').first().html();
    this.cloudExpand(cloudText);
    this.explodeBricks();
    this.injectContent($brick);
    this.addClickListeners(this.$clone);
    this.addClickListeners(this.$closePost, this.handleClose);
    this.setPageUrl($brick);
    window.onpopstate = () => this.closePost();
  }

  closePost() {
    this.destroyContent();
    this.resetAndPrime($('article'), 'transitions', 0, 0);
    this.cloudRetract();
    this.implodeBricks();
  }

  grabContent($brick) {
    this.$clone = $brick.clone(true, true);
    this.$clone.addClass('invisible');
    this.cloneCheck = false;
  }

  injectContent() {
    $('html, body').animate({ scrollTop: 0 }, 1000);
    this.$main.css('z-index', 50);
    this.$clone.removeAttr('style').attr('id', 'loadedPage')
      .find('header').first()
      .detach();
    this.$clone.find('.shadow').first().detach();
    this.$clone.appendTo('#heightDefined');
    this.$clone.removeClass('invisible');
    $('body').addClass('post-open');
  }

  destroyContent() {
    $('html, body').animate({ scrollTop: this.eventInfo.scrollTop }, 500);
    // this.$cloudLink[0].removeEventListener('click', this.handle);
    this.$clone.detach();
    this.cloneCheck = true;
    this.resetAndPrime(this.$main, 'hidden invisible', 0);
    $('body').removeClass('post-open');
  }
}
