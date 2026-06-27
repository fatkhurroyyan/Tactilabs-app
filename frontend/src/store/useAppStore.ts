import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'EDUCATOR' | 'ADMIN';
  xp: number;
  level: number;
  institutionId: string | null;
}

interface SensorData {
  voltage: number;
  current: number;
  power: number;
  components: string[];
  state: 'CONNECTED' | 'DISCONNECTED' | 'SHORT_CIRCUIT';
  isComplete: boolean;
}

interface AppState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  socket: Socket | null;
  sensorData: SensorData | null;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUserStats: (xp: number, level: number) => void;
  connectSocket: (userId: string, questId?: string) => void;
  disconnectSocket: () => void;
  updateCircuitStateInHardware: (state: string, components: string[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  socket: null,
  sensorData: null,

  login: (user, token) => {
    set({ user, accessToken: token, isAuthenticated: true });
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },

  logout: () => {
    get().disconnectSocket();
    set({ user: null, accessToken: null, isAuthenticated: false, sensorData: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  updateUserStats: (xp, level) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, xp, level };
      set({ user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  connectSocket: (userId, questId) => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io('http://localhost:4002', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket terhubung ke server');
      newSocket.emit('join_lab', { userId, questId });
    });

    newSocket.on('sensor_data', (data: SensorData) => {
      set({ sensorData: data });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, sensorData: null });
    }
  },

  updateCircuitStateInHardware: (state, components) => {
    const { socket } = get();
    if (socket) {
      socket.emit('update_circuit_state', { state, components });
    }
  }
}));

// Initialize store from localStorage on load
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('user');
  const savedToken = localStorage.getItem('token');
  if (savedUser && savedToken) {
    useAppStore.setState({
      user: JSON.parse(savedUser),
      accessToken: savedToken,
      isAuthenticated: true
    });
  }
}
