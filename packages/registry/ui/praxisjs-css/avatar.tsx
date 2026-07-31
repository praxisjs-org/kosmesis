import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Avatar as MorphosAvatar, AvatarFallback as MorphosAvatarFallback, AvatarImage as MorphosAvatarImage, type AvatarFallbackProps as MorphosAvatarFallbackProps  } from "@morphos/feedback";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class AvatarStyles extends Stylesheet {
  $root = this.css({
    position: "relative",
    display: "flex",
    width: "2rem",
    height: "2rem",
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: "9999px",
  });

  $image = this.css({ aspectRatio: "1 / 1", width: "100%", height: "100%" });

  $fallback = this.css({
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: t.muted,
    fontSize: "0.875rem",
    fontWeight: 500,
  });
}

// Extends (not wraps) Morphos's Avatar so `.setImageStatus()`/`.imageLoaded`/`.imageError` stay
// available for AvatarImage/AvatarFallback, which read them via their `avatar` prop.
@Component()
export class Avatar extends MorphosAvatar {
  @Styled(AvatarStyles) $s!: AvatarStyles;

  render() {
    return (
      <span id={this.id} class={cx(this.$s.$root, this.class)} data-status={() => this._imageStatus}>
        {this.children}
      </span>
    );
  }
}

export interface AvatarImageProps {
  avatar: Avatar;
  src: string;
  alt: string;
  class?: string;
}

@Component()
export class AvatarImage extends StatelessComponent<AvatarImageProps> {
  @Styled(AvatarStyles) $s!: AvatarStyles;

  render() {
    const { avatar, src, alt, class: cls } = this.props;
    return <MorphosAvatarImage avatar={avatar} src={src} alt={alt} class={cx(this.$s.$image, cls)} />;
  }
}

@Component()
export class AvatarFallback extends StatelessComponent<MorphosAvatarFallbackProps> {
  @Styled(AvatarStyles) $s!: AvatarStyles;

  render() {
    const { avatar, class: cls, id, children } = this.props;
    return (
      <MorphosAvatarFallback avatar={avatar} id={id} class={cx(this.$s.$fallback, cls)}>
        {children}
      </MorphosAvatarFallback>
    );
  }
}
