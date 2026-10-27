"use client";

import { Component, type ReactNode } from "react";

/** Swallows render errors (e.g. no WebGL) and shows a fallback instead of crashing the page. */
export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
