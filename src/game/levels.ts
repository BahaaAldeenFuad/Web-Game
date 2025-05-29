export interface LevelConfig {
  id: number;
  name: string;
  targetScore: number;  // Score needed to complete the level
  obstacleSpeed: number;
  obstacleFrequency: number;
  starThresholds: [number, number, number]; // Percentage of target score needed for each star (e.g., 60%, 80%, 100%)
}

export const levels: LevelConfig[] = [
  {
    id: 1,
    name: "Beginner's Path",
    targetScore: 3000,
    obstacleSpeed: 8,
    obstacleFrequency: 60,
    starThresholds: [1800, 2400, 3000] // 60%, 80%, 100%
  },
  {
    id: 2,
    name: "Rising Challenge",
    targetScore: 5000,
    obstacleSpeed: 10,
    obstacleFrequency: 55,
    starThresholds: [3000, 4000, 5000]
  },
  {
    id: 3,
    name: "Speed Test",
    targetScore: 7000,
    obstacleSpeed: 12,
    obstacleFrequency: 50,
    starThresholds: [4200, 5600, 7000]
  },
  {
    id: 4,
    name: "Obstacle Course",
    targetScore: 10000,
    obstacleSpeed: 13,
    obstacleFrequency: 45,
    starThresholds: [6000, 8000, 10000]
  },
  {
    id: 5,
    name: "Precision Run",
    targetScore: 12000,
    obstacleSpeed: 14,
    obstacleFrequency: 40,
    starThresholds: [7200, 9600, 12000]
  },
  {
    id: 6,
    name: "Expert Zone",
    targetScore: 15000,
    obstacleSpeed: 15,
    obstacleFrequency: 35,
    starThresholds: [9000, 12000, 15000]
  },
  {
    id: 7,
    name: "Master's Trial",
    targetScore: 18000,
    obstacleSpeed: 16,
    obstacleFrequency: 30,
    starThresholds: [10800, 14400, 18000]
  },
  {
    id: 8,
    name: "Speed Demon",
    targetScore: 20000,
    obstacleSpeed: 17,
    obstacleFrequency: 25,
    starThresholds: [12000, 16000, 20000]
  },
  {
    id: 9,
    name: "Ultimate Test",
    targetScore: 25000,
    obstacleSpeed: 18,
    obstacleFrequency: 20,
    starThresholds: [15000, 20000, 25000]
  },
  {
    id: 10,
    name: "Legend's Path",
    targetScore: 30000,
    obstacleSpeed: 20,
    obstacleFrequency: 15,
    starThresholds: [18000, 24000, 30000]
  }
]; 