export default class Task {
  constructor(id, title, description, phase, weight, status = "in-progress") {
    this.id = id
    this.title = title
    this.description = description
    this.phase = phase     // e.g. "Design"
    this.weight = weight   // light | medium | heavy
    this.status = status   // pending | in-progress | completed
  }
}
