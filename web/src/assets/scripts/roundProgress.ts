import { ProgressQuery, Result } from "@selab-2/groep-1-query";

/**
 * Check if any building of the round has been started.
 * @param progresses
 */
export function roundStarted(
  progresses: Array<Result<ProgressQuery>>,
): boolean {
  for (const progress of progresses) {
    if (progress.arrival != null) {
      return true;
    }
  }
  return false;
}

/**
 * Count how many buildings are completed for a given round.
 * @param progresses
 */
export function getCompletedBuildings(
  progresses: Array<Result<ProgressQuery>>,
): number {
  let count: number = 0;
  for (const progress of progresses) {
    if (progress.departure != null) {
      count++;
    }
  }
  return count;
}

/**
 * Count the amount of images taken for a given round
 * @param progresses
 */
export function getImagesAmount(
  progresses: Array<Result<ProgressQuery>>,
): number {
  let count: number = 0;
  for (const progress of progresses) {
    count += progress.images.length;
  }
  return count;
}

/**
 * Count the amount of comments for a given round
 * @param progresses
 */
export function getCommentsAmount(
  progresses: Array<Result<ProgressQuery>>,
): number {
  let count: number = 0;
  for (const progress of progresses) {
    if (progress.report !== "") {
      count++;
    }
  }
  return count;
}
