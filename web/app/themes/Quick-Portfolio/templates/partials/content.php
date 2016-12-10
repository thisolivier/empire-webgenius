<article <?php post_class(); ?>>
  <header>
    <h2 class="entry-title"><a class="magicLink"><?php the_title(); ?></a></h2>
    <?php get_template_part('partials/entry-meta'); ?>
  </header><br>
  <div class="post-meta">
    <?= \App\portfolio_meta(); ?>
    <p class="byline tags"><?php the_tags( '','','' ); ?> </p>
  </div>
  <div class="entry-content">
    <?php the_content(); ?>
  </div>
</article>
