export interface SM2Input {
  quality: 0 | 1 | 2 | 3 | 4 | 5
  reps: number
  easeFactor: number
  intervalDays: number
}

export interface SM2Result {
  reps: number
  easeFactor: number
  intervalDays: number
  nextReview: Date
}

export function sm2({ quality, reps, easeFactor, intervalDays }: SM2Input): SM2Result {
  let newReps = reps
  let newInterval = intervalDays

  if (quality < 3) {
    newReps = 0
    newInterval = 1
  } else {
    if (reps === 0) newInterval = 1
    else if (reps === 1) newInterval = 6
    else newInterval = Math.round(intervalDays * easeFactor)
    newReps = reps + 1
  }

  const newEase = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return { reps: newReps, easeFactor: newEase, intervalDays: newInterval, nextReview }
}
