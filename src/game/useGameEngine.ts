import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { LevelConfig } from './levels';
import { useGameContext } from '../context/GameContext';

interface GameEngineProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  levelConfig: LevelConfig;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  onDashCooldownUpdate: (cooldown: number) => void;
  isPaused: boolean;
}

export const useGameEngine = ({
  canvasRef,
  containerRef,
  levelConfig,
  onGameOver,
  onScoreUpdate,
  onDashCooldownUpdate,
  isPaused,
}: GameEngineProps) => {
  const { playerCharacter } = useGameContext();
  const engineRef = useRef(Matter.Engine.create({ gravity: { x: 0, y: 0 } }));
  const renderRef = useRef<Matter.Render | null>(null);
  const worldRef = useRef(engineRef.current.world);
  const playerRef = useRef<Matter.Body | null>(null);
  const obstaclesRef = useRef<Matter.Body[]>([]);
  const particlesRef = useRef<Matter.Body[]>([]);
  const scoreRef = useRef(0);
  const dashCooldownRef = useRef(0);
  const lastDashTimeRef = useRef(0);
  const gameSpeedRef = useRef(levelConfig.obstacleSpeed);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const dashPlayerFunctionRef = useRef<(() => void) | null>(null);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const lastVelocityRef = useRef<{ x: number; y: number } | null>(null);

  const createBallPlayer = (canvas: HTMLCanvasElement) => {
    const playerSize = Math.min(canvas.width, canvas.height) * 0.03;
    const player = Matter.Bodies.circle(canvas.width / 2, canvas.height - 100, playerSize, {
      render: {
        fillStyle: '#00ffd0',
        strokeStyle: '#00ffd0',
        lineWidth: 3,
      },
      friction: 0.05,
      frictionAir: 0.1,
      restitution: 0.2,
      density: 0.002,
      label: 'player'
    });
    return player;
  };

  const createCatPlayer = (canvas: HTMLCanvasElement) => {
    const catSize = Math.min(canvas.width, canvas.height) * 0.04;
    const catBody = Matter.Bodies.circle(canvas.width / 2, canvas.height - 100, catSize * 0.6, {
      render: {
        fillStyle: '#4A4A4A',
        strokeStyle: '#333333',
        lineWidth: 2
      },
      label: 'player'
    });

    const earSize = catSize * 0.4;
    const leftEar = Matter.Bodies.polygon(
      canvas.width / 2 - catSize * 0.4,
      canvas.height - 100 - catSize * 0.6,
      3,
      earSize,
      {
        render: {
          fillStyle: '#4A4A4A',
          strokeStyle: '#333333',
          lineWidth: 2
        }
      }
    );
    const rightEar = Matter.Bodies.polygon(
      canvas.width / 2 + catSize * 0.4,
      canvas.height - 100 - catSize * 0.6,
      3,
      earSize,
      {
        render: {
          fillStyle: '#4A4A4A',
          strokeStyle: '#333333',
          lineWidth: 2
        }
      }
    );

    const leftEye = Matter.Bodies.circle(
      canvas.width / 2 - catSize * 0.25,
      canvas.height - 100 - catSize * 0.1,
      catSize * 0.1,
      {
        render: {
          fillStyle: '#00ffd0',
          strokeStyle: '#00ffd0',
          lineWidth: 2
        }
      }
    );

    const rightEye = Matter.Bodies.circle(
      canvas.width / 2 + catSize * 0.25,
      canvas.height - 100 - catSize * 0.1,
      catSize * 0.1,
      {
        render: {
          fillStyle: '#00ffd0',
          strokeStyle: '#00ffd0',
          lineWidth: 2
        }
      }
    );

    Matter.Body.rotate(leftEar, Math.PI / 4);
    Matter.Body.rotate(rightEar, -Math.PI / 4);

    const cat = Matter.Body.create({
      parts: [catBody, leftEar, rightEar, leftEye, rightEye],
      friction: 0.05,
      frictionAir: 0.1,
      restitution: 0.2,
      density: 0.002,
      render: {
        fillStyle: '#4A4A4A',
        strokeStyle: '#333333',
        lineWidth: 2
      }
    });

    return cat;
  };

  const movePlayer = (x: number, y: number) => {
    if (!playerRef.current || isPaused) return;

    const baseSpeed = 3;
    const speed = playerCharacter === 'cat' ? baseSpeed * 1.2 : baseSpeed; // Cat is 20% faster
    Matter.Body.setVelocity(playerRef.current, {
      x: x * speed,
      y: y * speed,
    });
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const engine = engineRef.current;
    const world = worldRef.current;

    // Handle pause state changes
    if (playerRef.current) {
      if (isPaused) {
        // Store position and velocity when pausing
        if (!lastPositionRef.current) {
          lastPositionRef.current = { ...playerRef.current.position };
          lastVelocityRef.current = { ...playerRef.current.velocity };
          Matter.Body.setVelocity(playerRef.current, { x: 0, y: 0 });
        }
      } else if (lastPositionRef.current) {
        // Restore position and velocity when resuming
        Matter.Body.setPosition(playerRef.current, lastPositionRef.current);
        Matter.Body.setVelocity(playerRef.current, lastVelocityRef.current || { x: 0, y: 0 });
        lastPositionRef.current = null;
        lastVelocityRef.current = null;
      }
    }

    // Set initial canvas size
    const updateCanvasSize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Update render bounds if render exists
      if (renderRef.current) {
        renderRef.current.bounds.max.x = width;
        renderRef.current.bounds.max.y = height;
        renderRef.current.options.width = width;
        renderRef.current.options.height = height;
        Matter.Render.setPixelRatio(renderRef.current, window.devicePixelRatio);
      }

      // Update player position if it exists
      if (playerRef.current) {
        const safeY = height - 100;
        Matter.Body.setPosition(playerRef.current, {
          x: playerRef.current.position.x,
          y: Math.min(playerRef.current.position.y, safeY)
        });
      }

      // Update walls
      if (world) {
        const walls = world.bodies.filter(body => body.label === 'wall');
        walls.forEach(wall => Matter.World.remove(world, wall));

        const newWalls = [
          Matter.Bodies.rectangle(0, height/2, 60, height, { 
            isStatic: true,
            render: { fillStyle: 'transparent' },
            label: 'wall'
          }),
          Matter.Bodies.rectangle(width, height/2, 60, height, { 
            isStatic: true,
            render: { fillStyle: 'transparent' },
            label: 'wall'
          }),
        ];
        Matter.World.add(world, newWalls);
      }
    };

    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('orientationchange', updateCanvasSize);

    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // Add walls
    const walls = [
      Matter.Bodies.rectangle(0, canvas.height/2, 60, canvas.height, { 
        isStatic: true,
        render: { fillStyle: 'transparent' },
        label: 'wall'
      }),
      Matter.Bodies.rectangle(canvas.width, canvas.height/2, 60, canvas.height, { 
        isStatic: true,
        render: { fillStyle: 'transparent' },
        label: 'wall'
      }),
    ];
    Matter.World.add(world, walls);

    // Create player based on selection
    const player = playerCharacter === 'cat' ? createCatPlayer(canvas) : createBallPlayer(canvas);
    playerRef.current = player;
    Matter.World.add(world, player);

    // Add collision detection
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const isPlayerCollision = (body: Matter.Body) => {
          if (playerRef.current) {
            return body === playerRef.current || 
                   (playerRef.current.parts && playerRef.current.parts.includes(body));
          }
          return false;
        };

        const isObstacle = (body: Matter.Body) => body.label === 'obstacle';

        if ((isPlayerCollision(pair.bodyA) && isObstacle(pair.bodyB)) ||
            (isPlayerCollision(pair.bodyB) && isObstacle(pair.bodyA))) {
          
          if (playerCharacter === 'cat') {
            gsap.to(playerRef.current!.render, {
              fillStyle: '#ff0000',
              duration: 0.1,
              repeat: 3,
              yoyo: true,
              onComplete: () => {
                if (playerRef.current) {
                  playerRef.current.render.fillStyle = '#4A4A4A';
                }
                gsap.to(canvas, {
                  x: 10,
                  duration: 0.1,
                  repeat: 3,
                  yoyo: true,
                  onComplete: () => {
                    gsap.set(canvas, { x: 0 });
                    onGameOver(scoreRef.current);
                  }
                });
              }
            });
          } else {
            gsap.to(canvas, {
              x: 10,
              duration: 0.1,
              repeat: 3,
              yoyo: true,
              onComplete: () => {
                gsap.set(canvas, { x: 0 });
                onGameOver(scoreRef.current);
              }
            });
          }
        }
      });
    });

    // Initialize dash function
    dashPlayerFunctionRef.current = () => {
      const currentTime = Date.now();
      const cooldownDuration = playerCharacter === 'cat' ? 1000 : 1500;

      if (!playerRef.current || isPaused) return;
      if (currentTime - lastDashTimeRef.current < cooldownDuration) return;

      const baseDashForce = 15;
      const dashForce = playerCharacter === 'cat' ? baseDashForce * 1.5 : baseDashForce;
      const dashDuration = playerCharacter === 'cat' ? 0.2 : 0.15;

      // Get current movement direction or default to upward dash
      const currentVel = playerRef.current.velocity;
      let normalizedVel = {
        x: currentVel.x === 0 ? 0 : currentVel.x / Math.abs(currentVel.x),
        y: currentVel.y === 0 ? -1 : currentVel.y / Math.abs(currentVel.y),
      };

      // Normalize diagonal movement for dash
      if (normalizedVel.x !== 0 && normalizedVel.y !== 0) {
        const magnitude = Math.sqrt(2);
        normalizedVel.x /= magnitude;
        normalizedVel.y /= magnitude;
      }

      // Apply dash force
      Matter.Body.setVelocity(playerRef.current, {
        x: normalizedVel.x * dashForce,
        y: normalizedVel.y * dashForce,
      });

      // Make player temporarily invulnerable during dash
      playerRef.current.collisionFilter.category = 0x0002;
      if (playerRef.current.parts) {
        playerRef.current.parts.forEach(part => {
          part.collisionFilter.category = 0x0002;
        });
      }

      // Visual effects during dash
      if (playerCharacter === 'cat') {
        // Cat dash effect - more dynamic with ear movement and glow
        gsap.to(playerRef.current.render, {
          lineWidth: 8,
          strokeStyle: '#00ffd0',
          duration: dashDuration * 0.5,
          yoyo: true,
          repeat: 1,
        });

        // Create burst of particles for cat dash
        const burstCount = 8;
        for (let i = 0; i < burstCount; i++) {
          const angle = (i / burstCount) * Math.PI * 2;
          const distance = 30;
          setTimeout(() => {
            if (playerRef.current) {
              createParticle(
                playerRef.current.position.x + Math.cos(angle) * distance,
                playerRef.current.position.y + Math.sin(angle) * distance
              );
            }
          }, i * (dashDuration * 1000 / burstCount));
        }
      } else {
        // Ball dash effect - simple glow
        gsap.to(playerRef.current.render, {
          lineWidth: 8,
          duration: dashDuration,
          yoyo: true,
          repeat: 1,
        });
      }

      // Reset collision after dash with a small buffer
      const resetCollision = () => {
        if (playerRef.current) {
          playerRef.current.collisionFilter.category = 0x0001;
          if (playerRef.current.parts) {
            playerRef.current.parts.forEach(part => {
              part.collisionFilter.category = 0x0001;
            });
          }
        }
      };

      // Set up collision reset with a small buffer time
      const bufferTime = 50; // 50ms buffer
      setTimeout(resetCollision, dashDuration * 1000 + bufferTime);

      // Update last dash time and cooldown
      lastDashTimeRef.current = currentTime;
      dashCooldownRef.current = 1;
      onDashCooldownUpdate(1);
    };

    // Game loop
    const gameLoop = () => {
      if (playerRef.current) {
        if (isPaused) {
          // Store position and velocity when pausing
          if (!lastPositionRef.current) {
            lastPositionRef.current = { ...playerRef.current.position };
            lastVelocityRef.current = { ...playerRef.current.velocity };
            Matter.Body.setVelocity(playerRef.current, { x: 0, y: 0 });
          }
        } else {
          // Restore position and velocity when unpausing
          if (lastPositionRef.current) {
            Matter.Body.setPosition(playerRef.current, lastPositionRef.current);
            Matter.Body.setVelocity(playerRef.current, lastVelocityRef.current || { x: 0, y: 0 });
            lastPositionRef.current = null;
            lastVelocityRef.current = null;
          }

          const currentTime = Date.now();
          const cooldownDuration = playerCharacter === 'cat' ? 1000 : 1500;
          
          // Update score
          scoreRef.current += 1;
          onScoreUpdate(scoreRef.current);

          // Create particle trail
          if (scoreRef.current % 2 === 0) {
            createParticle(
              playerRef.current.position.x,
              playerRef.current.position.y
            );
          }

          // Update dash cooldown
          if (currentTime - lastDashTimeRef.current < cooldownDuration) {
            const remainingCooldown = 1 - ((currentTime - lastDashTimeRef.current) / cooldownDuration);
            dashCooldownRef.current = remainingCooldown;
            onDashCooldownUpdate(remainingCooldown);
          } else {
            dashCooldownRef.current = 0;
            onDashCooldownUpdate(0);
          }

          // Spawn obstacles based on level frequency
          if (scoreRef.current % levelConfig.obstacleFrequency === 0) {
            spawnObstacle(canvas.width, canvas.height);
          }

          // Update obstacle positions and remove off-screen ones
          obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
            Matter.Body.translate(obstacle, { x: 0, y: gameSpeedRef.current });
            
            if (obstacle.position.y > canvas.height + 100) {
              Matter.World.remove(world, obstacle);
              return false;
            }
            return true;
          });

          // Keep player within bounds
          if (playerRef.current.position.x < 30) {
            Matter.Body.setPosition(playerRef.current, {
              x: 30,
              y: playerRef.current.position.y
            });
          }
          if (playerRef.current.position.x > canvas.width - 30) {
            Matter.Body.setPosition(playerRef.current, {
              x: canvas.width - 30,
              y: playerRef.current.position.y
            });
          }

          // Add slight drag to slow down player
          Matter.Body.setVelocity(playerRef.current, {
            x: playerRef.current.velocity.x * 0.98,
            y: playerRef.current.velocity.y * 0.98
          });

          // Update physics only when not paused
          Matter.Engine.update(engine, 16.666);
        }
      }
    };

    // Create and configure the runner
    const runner = Matter.Runner.create({
      isFixed: true,
    });
    runnerRef.current = runner;

    // Start render
    Matter.Render.run(render);

    // Handle pause/unpause of physics
    if (isPaused) {
      Matter.Runner.stop(runner);
    } else {
      Matter.Runner.run(runner, engine);
    }

    const interval = setInterval(gameLoop, 16);

    return () => {
      clearInterval(interval);
      Matter.Render.stop(render);
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('orientationchange', updateCanvasSize);
      // Clear stored position/velocity
      lastPositionRef.current = null;
      lastVelocityRef.current = null;
    };
  }, [levelConfig, isPaused, playerCharacter]);

  const spawnObstacle = (width: number, height: number) => {
    const types = ['square', 'circle', 'rectangle'];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = Math.random() * 30 + 20;
    const x = Math.random() * (width - size * 2) + size;
    
    let obstacle;
    switch (type) {
      case 'circle':
        obstacle = Matter.Bodies.circle(x, -50, size/2, {
          label: 'obstacle',
          render: {
            fillStyle: '#ff00ff',
            strokeStyle: '#ff66ff',
            lineWidth: 2,
          },
          isStatic: false,
          density: 0.001,
          friction: 0.001,
          frictionAir: 0.001,
          restitution: 0.3,
        });
        break;
      case 'rectangle':
        obstacle = Matter.Bodies.rectangle(x, -50, size * 1.5, size/2, {
          label: 'obstacle',
          render: {
            fillStyle: '#ff00ff',
            strokeStyle: '#ff66ff',
            lineWidth: 2,
          },
          isStatic: false,
          density: 0.001,
          friction: 0.001,
          frictionAir: 0.001,
          restitution: 0.3,
        });
        break;
      default:
        obstacle = Matter.Bodies.rectangle(x, -50, size, size, {
          label: 'obstacle',
          render: {
            fillStyle: '#ff00ff',
            strokeStyle: '#ff66ff',
            lineWidth: 2,
          },
          isStatic: false,
          density: 0.001,
          friction: 0.001,
          frictionAir: 0.001,
          restitution: 0.3,
        });
    }

    // Add rotation
    Matter.Body.setAngularVelocity(obstacle, (Math.random() - 0.5) * 0.1);
    
    obstaclesRef.current.push(obstacle);
    Matter.World.add(worldRef.current, obstacle);
  };

  const resetGame = () => {
    // Reset score
    scoreRef.current = 0;
    onScoreUpdate(0);

    // Reset dash cooldown
    dashCooldownRef.current = 0;
    onDashCooldownUpdate(0);

    // Reset player position if it exists
    if (playerRef.current && canvasRef.current) {
      Matter.Body.setPosition(playerRef.current, {
        x: canvasRef.current.width / 2,
        y: canvasRef.current.height - 100
      });
      Matter.Body.setVelocity(playerRef.current, { x: 0, y: 0 });
    }

    // Clear all obstacles
    obstaclesRef.current.forEach(obstacle => {
      Matter.World.remove(worldRef.current, obstacle);
    });
    obstaclesRef.current = [];

    // Clear all particles
    particlesRef.current.forEach(particle => {
      Matter.World.remove(worldRef.current, particle);
    });
    particlesRef.current = [];
  };

  const createParticle = (x: number, y: number) => {
    const particleSize = playerCharacter === 'cat' ? Math.min(canvasRef.current!.width, canvasRef.current!.height) * 0.01 : 2;
    const particle = Matter.Bodies.circle(x, y, particleSize, {
      render: {
        fillStyle: '#00ffd0',
        opacity: 0.5,
      },
      isStatic: true,
      collisionFilter: {
        category: 0x0002,
        mask: 0x0000,
      },
    });
    
    particlesRef.current.push(particle);
    Matter.World.add(worldRef.current, particle);

    gsap.to(particle.render, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        Matter.World.remove(worldRef.current, particle);
        particlesRef.current = particlesRef.current.filter(p => p !== particle);
      }
    });
  };

  return {
    movePlayer,
    dashPlayer: () => dashPlayerFunctionRef.current?.(),
    resetGame,
  };
};

export default useGameEngine;