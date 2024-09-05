const commentPostedTime = (timeInMileSec) => {
  let sec = (timeInMileSec / 1000).toFixed(0);
  let min = (timeInMileSec / (1000 * 60)).toFixed(0);
  let hrs = (timeInMileSec / (1000 * 60 * 60)).toFixed(0);
  let days = (timeInMileSec / (1000 * 60 * 60 * 24)).toFixed(0);
  let weeks = (timeInMileSec / (1000 * 60 * 60 * 24 * 7)).toFixed(0);
  let months = (timeInMileSec / (1000 * 60 * 60 * 24 * 31)).toFixed(0);
  let years = (timeInMileSec / (1000 * 60 * 60 * 24 * 12)).toFixed(0);

  if (sec < 60) {
    return sec + "초";
  } else if (min < 60) {
    return min + "분";
  } else if (hrs < 24) {
    return hrs + "시간";
  } else if (days < 7) {
    return days + "일";
  } else if (weeks < 4) {
    return weeks + "주";
  } else if (months < 12) {
    return months + "달";
  } else {
    return years + "년";
  }
};

export { commentPostedTime };
