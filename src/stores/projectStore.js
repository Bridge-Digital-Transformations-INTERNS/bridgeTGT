import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { WEIGHTS } from '../utils/weights'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([
    {
      id: 1,
      name: 'Procurement System',
      tasks: [
        { id: 11, title: 'Prototyping Dashboard', phase: 'Designing', weight: 'heavy', status: 'completed', assignee: 'Ana', estimatedDays: 3 },
        { id: 12, title: 'Translate Landing Page', phase: 'Implementation', weight: 'medium', status: 'inprogress', assignee: 'Ben', estimatedDays: 2 },
        { id: 13, title: 'Unit tests for API', phase: 'Testing/QA', weight: 'light', status: 'pending', assignee: 'Carlo', estimatedDays: 0.5 },
        { id: 14, title: 'Design Forms', phase: 'Designing', weight: 'medium', status: 'completed', assignee: 'Dana', estimatedDays: 2 }
      ]
    }
  ])

  const selectedProjectId = ref(1)
  const selectedPhase = ref('Overall')

  const selectedProject = computed(() => projects.value.find(p => p.id === selectedProjectId.value))

  function addProject(name) {
    projects.value.push({ id: Date.now(), name, tasks: [] })
  }

  function deleteProject(id) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx >= 0) projects.value.splice(idx, 1)
    if (selectedProjectId.value === id && projects.value.length) selectedProjectId.value = projects.value[0].id
  }

  function addTask(projectId, task) {
    const p = projects.value.find(x => x.id === projectId)
    if (p) p.tasks.push({ ...task, id: Date.now() })
  }

  function updateTask(projectId, taskId, patch) {
    const p = projects.value.find(x => x.id === projectId)
    if (!p) return
    const t = p.tasks.find(x => x.id === taskId)
    if (t) Object.assign(t, patch)
  }

  const filteredTasks = computed(() => {
    const p = selectedProject.value
    if (!p) return []
    if (selectedPhase.value === 'Overall') return p.tasks
    return p.tasks.filter(t => t.phase === selectedPhase.value)
  })

  const counts = computed(() => {
    const p = selectedProject.value
    if (!p) return { totalTasks: 0, light: 0, medium: 0, heavy: 0, completed: 0, inprogress: 0, pending: 0 }
    const res = { totalTasks: 0, light: 0, medium: 0, heavy: 0, completed: 0, inprogress: 0, pending: 0 }
    p.tasks.forEach(t => {
      res.totalTasks += 1
      if (t.weight === 'light') res.light += 1
      if (t.weight === 'medium') res.medium += 1
      if (t.weight === 'heavy') res.heavy += 1
      if (t.status === 'completed') res.completed += 1
      if (t.status === 'inprogress') res.inprogress += 1
      if (t.status === 'pending') res.pending += 1
    })
    return res
  })

  const points = computed(() => {
    const p = selectedProject.value
    if (!p) return { completed: 0, total: 0 }
    let completed = 0
    let total = 0
    p.tasks.forEach(t => {
      const w = WEIGHTS[t.weight] || 1
      total += w
      if (t.status === 'completed') completed += w
    })
    return { completed, total }
  })

  const percent = computed(() => {
    const { completed, total } = points.value
    return total === 0 ? 0 : (completed / total) * 100
  })

  return {
    projects,
    selectedProjectId,
    selectedPhase,
    selectedProject,
    addProject,
    deleteProject,
    addTask,
    updateTask,
    filteredTasks,
    counts,
    points,
    percent
  }
})
