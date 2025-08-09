'use client';

import { ResetIcon } from './Icons';
import '@/app/styles/MonthDropdown.scss';

export default function MonthDropdown({ month, setMonth, currentMonthSelected }: { month: number, setMonth: (month: number) => void, currentMonthSelected: boolean }) {

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const monthNumber = parseInt(e.target.value);
    setMonth(monthNumber);
  };

  const handleNowClick = () => {
    setMonth(new Date().getMonth() + 1);
  };

  return (
    <div>
      <select className='month-dropdown' onChange={handleMonthChange} value={month}>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <button className='button reset-button' onClick={handleNowClick} disabled={currentMonthSelected}>
        <ResetIcon width={10} height={10} />
        <span>Reset</span>
      </button>
    </div>
  );
}