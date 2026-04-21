# Simulation Components - Mô Phỏng Lịch Trình

## Tổng quan
Hệ thống component để mô phỏng thời gian thực hoạt động của các chuyến tàu theo lịch trình đã lập.

## Kiến trúc Component

### 1. useSimulation Hook
**File**: `hooks/useSimulation.js`

**Chức năng**:
- Quản lý state mô phỏng (playing, paused, speed)
- Tính toán thời gian và trạng thái tàu
- Tạo event log tự động
- Cung cấp statistics real-time

**State Management**:
```javascript
{
  isPlaying: boolean,
  speed: 1 | 2 | 5 | 10,
  currentTime: Date,
  trainStates: Array<TrainState>,
  events: Array<Event>,
  stats: Statistics
}
```

**Train States**:
- `WAITING`: Chờ đến ga
- `APPROACHING`: Đang tiến vào ga (10 phút trước)
- `ARRIVED`: Đã đến ga
- `DEPARTING`: Chuẩn bị xuất phát (1 phút trước)
- `DEPARTED`: Đã rời ga

**API**:
```javascript
const {
  isPlaying,
  speed,
  currentTime,
  trainStates,
  events,
  stats,
  play,
  pause,
  reset,
  setSpeed,
  initialize
} = useSimulation(lichTrinh, duongRay);
```

---

### 2. SimulationControls Component
**File**: `components/simulation/SimulationControls.jsx`

**Props**:
```typescript
{
  isPlaying: boolean,
  speed: number,
  onPlay: () => void,
  onPause: () => void,
  onReset: () => void,
  onSpeedChange: (speed: number) => void
}
```

**Features**:
- Play/Pause button với icon động
- Reset button
- Speed selector (1x, 2x, 5x, 10x)
- Status indicator (ĐANG CHẠY/TẠM DỪNG)

**UI Elements**:
- 🐌 1x - Chậm
- 🚶 2x - Bình thường
- 🏃 5x - Nhanh
- 🚀 10x - Rất nhanh

---

### 3. SimulationStats Component
**File**: `components/simulation/SimulationStats.jsx`

**Props**:
```typescript
{
  stats: {
    total: number,
    waiting: number,
    approaching: number,
    arrived: number,
    departed: number,
    delayed: number
  },
  currentTime: Date
}
```

**Features**:
- Hiển thị thời gian mô phỏng hiện tại
- 6 stat cards với màu sắc phân biệt
- Hover animation
- Real-time updates

**Stat Cards**:
1. 🚂 Tổng số tàu (Navy)
2. ⏳ Chờ đến (Gray)
3. 🚄 Đang đến (Blue)
4. 🏢 Tại ga (Green)
5. ✅ Đã rời (Purple)
6. ⚠️ Bị trễ (Orange)

---

### 4. SimulationTrainCard Component
**File**: `components/simulation/SimulationTrainCard.jsx`

**Props**:
```typescript
{
  train: {
    maLichTrinh: string,
    maChuyenTau: string,
    maRay: string,
    status: TrainStatus,
    gioDenDuKien: Date,
    gioDiDuKien: Date,
    gioDenThucTe: Date | null,
    gioDiThucTe: Date | null,
    soPhutTre: number,
    position: number // 0-100%
  }
}
```

**Features**:
- Progress bar animation (0-100%)
- Status badge với màu sắc
- Thời gian dự kiến vs thực tế
- Delay warning
- Smooth transitions

**Status Colors**:
- WAITING: Gray
- APPROACHING: Blue
- ARRIVED: Green
- DEPARTING: Orange
- DEPARTED: Purple

---

### 5. SimulationEventLog Component
**File**: `components/simulation/SimulationEventLog.jsx`

**Props**:
```typescript
{
  events: Array<{
    time: Date,
    type: 'SYSTEM' | 'TRAIN' | 'ARRIVAL' | 'DEPARTURE',
    trainId?: string,
    message: string,
    severity: 'info' | 'success' | 'warning' | 'error'
  }>
}
```

**Features**:
- Scrollable event list (max 50 events)
- Chronological order (newest first)
- Color-coded by severity
- Slide-in animation for new events
- Empty state

**Event Types**:
- ℹ️ Info (Blue)
- ✅ Success (Green)
- ⚠️ Warning (Orange)
- ❌ Error (Red)

---

### 6. MoPhongLichTrinhPage
**File**: `pages/dieuhanh/MoPhongLichTrinhPage.jsx`

**Main Page Component**

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Header + Date Selector                          │
├─────────────────────────────────────────────────┤
│ Simulation Controls                             │
├──────────┬──────────────────────┬───────────────┤
│  Stats   │   Train Cards Grid   │  Event Log    │
│ (300px)  │      (Flexible)      │   (350px)     │
│          │                      │               │
└──────────┴──────────────────────┴───────────────┘
```

**Features**:
- Date selector
- Auto-fetch data on date change
- Initialize simulation on data load
- Responsive grid layout
- Empty state handling
- Loading state

---

## Simulation Logic

### Time Progression
```
Real Time → Simulation Time
1 second → 1 minute (at 1x speed)
1 second → 2 minutes (at 2x speed)
1 second → 5 minutes (at 5x speed)
1 second → 10 minutes (at 10x speed)
```

### State Transitions
```
WAITING
  ↓ (10 minutes before arrival)
APPROACHING
  ↓ (arrival time reached)
ARRIVED
  ↓ (1 minute before departure)
DEPARTING
  ↓ (departure time reached)
DEPARTED
```

### Position Animation
```
WAITING:     position = 0%
APPROACHING: position = 10% → 50% (linear)
ARRIVED:     position = 50%
DEPARTING:   position = 70%
DEPARTED:    position = 100%
```

---

## Event Generation

### Automatic Events
1. **System Start**: Khi bắt đầu mô phỏng
2. **Train Approaching**: 10 phút trước giờ đến
3. **Train Arrived**: Khi tàu đến ga
4. **Train Departing**: 1 phút trước giờ đi
5. **Train Departed**: Khi tàu rời ga

### Event Properties
- Timestamp
- Train ID (if applicable)
- Message
- Severity level

---

## Styling & Animations

### CSS Animations
```css
@keyframes pulse - Status indicator
@keyframes slideIn - New events
@keyframes fadeIn - General fade
@keyframes trainMove - Train movement
```

### Color Palette
- Navy: Primary/System
- Blue: Approaching
- Green: Success/Arrived
- Orange: Warning/Departing
- Purple: Departed
- Gray: Waiting
- Red: Error/Delay

---

## Usage Example

```jsx
import MoPhongLichTrinhPage from './pages/dieuhanh/MoPhongLichTrinhPage';

// In App.jsx
<Route path="/dieu-hanh/mo-phong" element={<MoPhongLichTrinhPage />} />
```

---

## Best Practices

### Component Design
✅ Single Responsibility - Mỗi component có 1 nhiệm vụ rõ ràng
✅ Reusable - Có thể tái sử dụng với props khác nhau
✅ Composable - Kết hợp dễ dàng
✅ Testable - Logic tách biệt trong hook

### Performance
✅ useMemo cho calculations
✅ useCallback cho event handlers
✅ Cleanup intervals trong useEffect
✅ Limit event log (50 items)

### UX
✅ Visual feedback rõ ràng
✅ Smooth animations
✅ Color-coded information
✅ Empty states
✅ Loading states

---

## Future Enhancements

### Phase 2
- [ ] Pause at specific time
- [ ] Jump to time
- [ ] Playback history
- [ ] Export simulation report

### Phase 3
- [ ] Conflict detection
- [ ] What-if scenarios
- [ ] Multiple simulations comparison
- [ ] AI-powered predictions

### Phase 4
- [ ] 3D visualization
- [ ] Real-time sync with actual trains
- [ ] Mobile app
- [ ] Voice notifications

---

## Testing

### Unit Tests
- useSimulation hook logic
- State transitions
- Event generation
- Statistics calculation

### Integration Tests
- Component interactions
- Data flow
- API calls
- Route navigation

### E2E Tests
- Full simulation flow
- Speed changes
- Reset functionality
- Date selection

---

## Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x"
}
```

No external libraries required! Pure React implementation.

---

## Performance Metrics

- Initial Load: < 1s
- State Update: < 16ms (60fps)
- Memory Usage: < 50MB
- Event Processing: < 5ms

---

## Accessibility

- Keyboard navigation support
- ARIA labels
- Color contrast compliance
- Screen reader friendly
- Focus management

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## License

Internal use only - Hệ thống Quản lý Lịch trình Tàu Ga Đà Nẵng
