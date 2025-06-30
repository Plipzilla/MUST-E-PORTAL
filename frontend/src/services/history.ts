// Custom history object to allow navigation outside react components
// Based on: https://jasonwatmore.com/react-router-6-navigate-outside-react-components

import { NavigateFunction, Location } from 'react-router-dom';

interface HistoryHelper {
  navigate: NavigateFunction | null;
  location: Location | null;
}

// History helper object that will be initialized from within Router context
export const history: HistoryHelper = {
  navigate: null,
  location: null
}; 