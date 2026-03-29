import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function Calendar(props: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker className="rounded-md bg-slate-900 p-3 text-white" {...props} />;
}
