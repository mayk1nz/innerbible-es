import type { LessonContent } from '../../catalog'
import { fetchContent } from '../fetch-content'
import type { PlanId } from './titles'

// A plan day's text comes from the server (/api/content/planes/<plan>/<day>) only when a
// member who owns the plan opens it: the texts are never part of the app's JavaScript.
export function loadPlanDay(plan: PlanId, day: number): Promise<LessonContent | null> {
  return fetchContent<LessonContent>(`planes/${plan}/${day}`)
}
