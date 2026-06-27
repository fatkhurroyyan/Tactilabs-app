import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth.routes';
import questRoutes from './routes/quest.routes';
import profileRoutes from './routes/profile.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import educatorRoutes from './routes/educator.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Use helmet for HTTP security headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Apply rate limiter on all API endpoints
app.use('/api', apiLimiter);

// CORS configuration
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:4001'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Custom cookie-parser middleware to avoid external npm dependency issues
app.use((req: any, res: Response, next: NextFunction) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie: string) => {
      const parts = cookie.split('=');
      if (parts.length === 2) {
        req.cookies[parts[0].trim()] = decodeURIComponent(parts[1].trim());
      }
    });
  }
  next();
});

// Setup API routes
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/educator', educatorRoutes);
app.use('/api/admin', adminRoutes);

// Healthy check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Socket.IO real-time electron flow & ESP32 hardware simulator
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Active sirkuit simulations per user
const activeSimulations = new Map<string, NodeJS.Timeout>();

io.on('connection', (socket) => {
  console.log(`Socket client terhubung: ${socket.id}`);

  // Event: Join lab workspace room
  socket.on('join_lab', (data: { userId: string; questId?: string }) => {
    const { userId, questId } = data;
    console.log(`User ${userId} bergabung ke Lab Workspace untuk quest: ${questId || 'Sandbox'}`);
    socket.join(userId);

    // Clear any existing active simulation for this user
    if (activeSimulations.has(userId)) {
      clearInterval(activeSimulations.get(userId)!);
    }

    // Start ESP32 Mock Data Streamer
    let componentList = ['BATTERY'];
    let state = 'CONNECTED'; // CONNECTED, DISCONNECTED, SHORT_CIRCUIT
    let isComplete = false;

    const intervalId = setInterval(() => {
      // Simulate real-time voltage, current fluctuate
      let voltage = 0;
      let current = 0;
      let power = 0;

      if (state === 'CONNECTED') {
        // Slowly add components based on time step
        const rnd = Math.random();
        if (componentList.length < 3 && rnd > 0.7) {
          if (!componentList.includes('RESISTOR')) {
            componentList.push('RESISTOR');
          } else if (!componentList.includes('LED')) {
            componentList.push('LED');
          }
        }

        // Calculate values based on present components
        if (componentList.includes('RESISTOR') && componentList.includes('LED')) {
          voltage = 4.85 + Math.random() * 0.15; // ~5V
          current = 18.0 + Math.random() * 1.5; // ~19mA
          power = (voltage * current) / 1000; // in W
          isComplete = true; // Complete Ohm's law condition
        } else if (componentList.includes('RESISTOR')) {
          voltage = 4.95 + Math.random() * 0.05;
          current = 0.5 + Math.random() * 0.1; // Open circuit or minimal current leakage
          power = (voltage * current) / 1000;
          isComplete = false;
        } else {
          voltage = 5.0;
          current = 0;
          power = 0;
          isComplete = false;
        }
      } else if (state === 'SHORT_CIRCUIT') {
        voltage = 1.2 + Math.random() * 0.3;
        current = 450 + Math.random() * 20; // Massive dangerous current
        power = (voltage * current) / 1000;
        isComplete = false;
      }

      socket.emit('sensor_data', {
        timestamp: new Date(),
        voltage: parseFloat(voltage.toFixed(2)),
        current: parseFloat(current.toFixed(1)),
        power: parseFloat((power * 1000).toFixed(1)), // in mW
        components: componentList,
        state,
        isComplete
      });
    }, 1000);

    activeSimulations.set(userId, intervalId);

    // Listen for manual actions from Lab UI
    socket.on('update_circuit_state', (newState: { state: string; components?: string[] }) => {
      console.log(`Update state sirkuit dari UI:`, newState);
      if (newState.state) state = newState.state;
      if (newState.components) componentList = newState.components;
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket client terputus: ${socket.id}`);
    // Clean up simulation timers
    for (const [userId, timer] of activeSimulations.entries()) {
      // Find if this socket belonged to user
      // Simple cleanup for now
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`⚡ Server Tactilabs berjalan di port ${PORT}`);
});
