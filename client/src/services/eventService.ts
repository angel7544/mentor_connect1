import axios from 'axios';
import { API_BASE_URL, EventType, EventStatus } from '../config';

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  location: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  isOnline: boolean;
  meetingLink?: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  attendees: string[];
  capacity: number;
  status: EventStatus;
  isPublic: boolean;
  registrationDeadline?: string;
  tags: string[];
  image?: string;
}

export interface EventFilters {
  status?: string;
  category?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  isPublic?: boolean;
  limit?: number;
  skip?: number;
}

class EventService {
  private baseUrl = `${API_BASE_URL}/events`;

  async getAllEvents(filters?: EventFilters) {
    const response = await axios.get(this.baseUrl, { params: filters });
    return response.data;
  }

  async getEventById(id: string) {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createEvent(eventData: Omit<Event, '_id' | 'organizer' | 'attendees' | 'status'>) {
    const response = await axios.post(this.baseUrl, eventData);
    return response.data;
  }

  async updateEvent(id: string, eventData: Partial<Event>) {
    const response = await axios.put(`${this.baseUrl}/${id}`, eventData);
    return response.data;
  }

  async deleteEvent(id: string) {
    const response = await axios.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async registerForEvent(id: string) {
    const response = await axios.post(`${this.baseUrl}/${id}/register`);
    return response.data;
  }

  async cancelRegistration(id: string) {
    const response = await axios.post(`${this.baseUrl}/${id}/cancel-registration`);
    return response.data;
  }

  async getUpcomingEvents() {
    const response = await axios.get(`${this.baseUrl}/upcoming`);
    return response.data;
  }

  async getUserEvents() {
    const response = await axios.get(`${this.baseUrl}/my-events`);
    return response.data;
  }

  async getOrganizedEvents() {
    const response = await axios.get(`${this.baseUrl}/organized`);
    return response.data;
  }
}

export const eventService = new EventService(); 