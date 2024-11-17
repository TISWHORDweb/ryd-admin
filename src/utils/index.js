import moment from 'moment-timezone';

export const totalCohortChild = (programs,id) => {
  const filteredPrograms = programs.filter((program) => program.partnerId === id);
  const programCount = filteredPrograms.reduce((count, program) => {
    const childId = program.childId;
    if (!count.has(childId)) {
      count.set(childId, 1);
    }
    return count;
  }, new Map());

  return programCount.size
};


export const totalCohortParent = (programs,id) => {
  const filteredPrograms = programs.filter((program) => program.partnerId === id);
  const programCount = filteredPrograms.reduce((count, program) => {
    const parentId = program.child.parentId;
    if (!count.has(parentId)) {
      count.set(parentId, 1);
    }
    return count;
  }, new Map());

  return programCount.size
};


export function newFormatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad with zero if needed
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
  const year = date.getUTCFullYear(); // Get full year

  return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
}

export function calculateDebt(programs) {
  const debt = programs.filter((program) => program.partner_package && !program.isPaid)
    .reduce((total, program) => total + program.partner_package.amount, 0);
  return debt
}

export function convertLessonTimes(times, parentTimezone) {
  const defaultTimezone = "Africa/Lagos";
  
  const convertedTimes = times.map(slot => {
    const time = moment.tz(
      `${slot.timeText} ${slot.dayText}`, 
      "hA dddd", 
      defaultTimezone
    );
    
    const convertedTime = defaultTimezone === parentTimezone 
      ? time 
      : time.clone().tz(parentTimezone);
    
    return `${slot.dayText} ${convertedTime.format('h:mmA')}`;
  });

  return convertedTimes.join(', ');
}
