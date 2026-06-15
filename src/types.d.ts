export interface Profile {
  id: string;
  name: string;
  colour: string;
  photo: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  colour: string;
  allowedProfiles: string[];
}

export interface AppEvent {
  id: string;
  name: string;
  startDate: string;
  recurrenceDays: number;
  photo: string;
}

export interface Assignment {
  profileId: string;
  shiftId: string;
}
