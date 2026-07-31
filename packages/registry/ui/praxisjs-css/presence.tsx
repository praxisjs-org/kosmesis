import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

class PresenceStyles extends Stylesheet {
  $group = this.css({ display: "flex", alignItems: "center" });

  $avatar = this.css({
    position: "relative",
    marginLeft: "-0.625rem",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "9999px",
    border: `2px solid ${t.background}`,
    backgroundColor: t.muted,
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t.mutedForeground,
  }).on("&:first-child", { marginLeft: 0 });

  $image = this.css({ width: "100%", height: "100%", objectFit: "cover" });

  $overflow = this.css({
    position: "relative",
    marginLeft: "-0.625rem",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    border: `2px solid ${t.background}`,
    backgroundColor: t.secondary,
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t.secondaryForeground,
  });

  $dot = this.css({
    display: "inline-block",
    height: "0.625rem",
    width: "0.625rem",
    borderRadius: "9999px",
    boxShadow: `0 0 0 2px ${t.background}`,
  })
    .on('&[data-status="online"]', { backgroundColor: "#10b981" })
    .on('&[data-status="away"]', { backgroundColor: "#eab308" })
    .on('&[data-status="offline"]', { backgroundColor: `color-mix(in oklab, ${t.mutedForeground} 40%, transparent)` });
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
  @Styled(PresenceStyles) $s!: PresenceStyles;

  render() {
    const { users, max = 5, size = 32, class: cls, id } = this.props;
    const visible = users.slice(0, max);
    const overflow = users.length - visible.length;

    return (
      <div id={id} role="group" aria-label="Active users" class={cx(this.$s.$group, cls)}>
        {visible.map((user, i) => (
          <span
            key={user.id}
            title={user.name}
            class={this.$s.$avatar}
            style={{ width: `${String(size)}px`, height: `${String(size)}px`, zIndex: visible.length - i }}
          >
            {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} class={this.$s.$image} /> : getInitials(user.name)}
          </span>
        ))}
        {overflow > 0 && (
          <span class={this.$s.$overflow} style={{ width: `${String(size)}px`, height: `${String(size)}px` }}>
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
  @Styled(PresenceStyles) $s!: PresenceStyles;

  render() {
    const { status = "online", class: cls } = this.props;
    return <span data-status={status} class={cx(this.$s.$dot, cls)} />;
  }
}
