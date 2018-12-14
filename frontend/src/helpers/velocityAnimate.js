import Velocity from 'velocity-animate'

export const lineBeforeEnter = (el, x1, y1, x2, y2) => {
  Velocity(el, {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    opacity: 1 },
  { duration: 0 })
}

export const lineEnter = (el, x2, y2) => {
  Velocity(el, {
    x2: x2,
    y2: y2 },
  { duration: 300 })
}

export const lineLeave = (el, x1, y1, x2, y2) => {
  Velocity(el, {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    opacity: 0 },
  { duration: 300 })
}

export const circleBeforeEnter = (el, cx, cy) => {
  Velocity(el, {
    cx: cx,
    cy: cy,
    opacity: 1 },
  { duration: 0 })
}

export const circleEnter = (el, cx, cy) => {
  Velocity(el, {
    cx: cx,
    cy: cy },
  { duration: 300 })
}

export const circleLeave = (el, cx, cy) => {
  Velocity(el, {
    cx: cx,
    cy: cy,
    opacity: 0 },
  { duration: 300 })
}

export const textBeforeEnter = (el, x, y) => {
  Velocity(el, {
    x: x,
    y: y,
    opacity: 1 },
  { duration: 0 })
}

export const textEnter = (el, x, y) => {
  Velocity(el, {
    x: x,
    y: y },
  { duration: 300 })
}

export const textLeave = (el, x, y) => {
  Velocity(el, {
    x: x,
    y: y,
    opacity: 0 },
  { duration: 300 })
}
