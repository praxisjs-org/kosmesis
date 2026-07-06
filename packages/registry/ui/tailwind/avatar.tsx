import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Avatar as MorphosAvatar, AvatarFallback as MorphosAvatarFallback, AvatarImage as MorphosAvatarImage, type AvatarFallbackProps as MorphosAvatarFallbackProps  } from "@morphos/feedback";

import { cn } from "@/lib/utils";

/**
 * Extends (not wraps) Morphos's `Avatar` so `new Avatar()` still yields a real instance with
 * `.setImageStatus()`/`.imageLoaded`/`.imageError` — what `AvatarImage`/`AvatarFallback` need via
 * their `avatar` prop.
 */
@Component()
export class Avatar extends MorphosAvatar {
  render() {
    return (
      <span id={this.id} class={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", this.class)} data-status={() => this._imageStatus}>
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
  render() {
    const { avatar, src, alt, class: cls } = this.props;
    return <MorphosAvatarImage avatar={avatar} src={src} alt={alt} class={cn("aspect-square size-full", cls)} />;
  }
}

@Component()
export class AvatarFallback extends StatelessComponent<MorphosAvatarFallbackProps> {
  render() {
    const { avatar, class: cls, id, children } = this.props;
    return (
      <MorphosAvatarFallback
        avatar={avatar}
        id={id}
        class={cn("flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium", cls)}
      >
        {children}
      </MorphosAvatarFallback>
    );
  }
}
