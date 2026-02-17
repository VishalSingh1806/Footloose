function DailyBatchStatus({ remaining, total, isExhausted }) {
  if (isExhausted) {
    return (
      <p className="text-sm text-[#6C757D]">
        No more profiles today
      </p>
    );
  }

  if (remaining === 0) {
    return (
      <p className="text-sm text-[#6C757D]">
        Loading...
      </p>
    );
  }

  // Show specific message when getting low
  if (remaining <= 3) {
    return (
      <p className="text-sm text-[#6C757D]">
        {remaining} profile{remaining !== 1 ? 's' : ''} remaining today
      </p>
    );
  }

  return (
    <p className="text-sm text-[#6C757D]">
      {remaining} profile{remaining !== 1 ? 's' : ''} to review
    </p>
  );
}

export default DailyBatchStatus;
