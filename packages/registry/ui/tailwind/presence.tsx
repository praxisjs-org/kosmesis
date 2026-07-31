import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export interface PresenceUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface PresenceProps {
  users: PresenceUser[];
  max?: number;
  size?: number;
  class?: string;
  id?: string;
}

// Doesn't reuse `Avatar`: Morphos's `Avatar` needs one instance per user, which doesn't compose with a flat `users` array prop.
@Component()
export class Presence extends StatelessComponent<PresenceProps> {
  render() {
    const { users, max = 5, size = 32, class: cls, id } = this.props;
    const visible = users.slice(0, max);
    const overflow = users.length - visible.length;

    return (
      <div id={id} role="group" aria-label="Active users" class={cn("flex items-center", cls)}>
        {visible.map((user, i) => (
          <span
            key={user.id}
            title={user.name}
            class="relative -ml-2.5 inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground first:ml-0"
            style={{ width: `${String(size)}px`, height: `${String(size)}px`, zIndex: visible.length - i }}
          >
            {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} class="size-full object-cover" /> : getInitials(user.name)}
          </span>
        ))}
        {overflow > 0 && (
          <span
            class="relative -ml-2.5 inline-flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium text-secondary-foreground"
            style={{ width: `${String(size)}px`, height: `${String(size)}px` }}
          >
            {`+${String(overflow)}`}
          </span>
        )}
      </div>
    );
  }
}

export type PresenceStatus = "online" | "away" | "offline";

export interface PresenceDotProps {
  status?: PresenceStatus;
  class?: string;
}

@Component()
export class PresenceDot extends StatelessComponent<PresenceDotProps> {
  render() {
    const { status = "online", class: cls } = this.props;
    return (
      <span
        data-status={status}
        class={cn(
          "inline-block size-2.5 rounded-full ring-2 ring-background",
          "data-[status=online]:bg-emerald-500 data-[status=away]:bg-yellow-500 data-[status=offline]:bg-muted-foreground/40",
          cls,
        )}
      />
    );
  }
}
