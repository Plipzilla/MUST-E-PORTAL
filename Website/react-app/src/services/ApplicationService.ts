import axios, { AxiosResponse } from 'axios';

export interface ApplicationDraft {
  id?: number;
  user_id?: number;
  step_1_personal_info?: any;
  step_2_education?: any;
  step_3_motivation?: any;
  step_4_special_needs?: any;
  step_5_referees?: any;
  current_step: number;
  completion_percentage: number;
  last_saved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationSubmission {
  id?: number;
  user_id?: number;
  application_type: string;
  personal_info: any;
  education_info: any;
  motivation_info: any;
  special_needs_info: any;
  referees_info: any;
  work_experiences?: WorkExperience[];
  referees?: Referee[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkExperience {
  id?: number;
  organization: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Referee {
  id?: number;
  name: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
  relationship: string;
  created_at?: string;
  updated_at?: string;
}

class ApplicationService {
  // Get current application draft
  async getDraft(): Promise<ApplicationDraft | null> {
    try {
      const response: AxiosResponse<{ draft: ApplicationDraft }> = await axios.get('/applications/draft');
      return response.data.draft;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No draft exists
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch application draft');
    }
  }

  // Save application draft
  async saveDraft(draftData: Partial<ApplicationDraft>): Promise<ApplicationDraft> {
    try {
      const response: AxiosResponse<{ draft: ApplicationDraft }> = await axios.post('/applications/draft', draftData);
      return response.data.draft;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to save application draft');
    }
  }

  // Update application draft
  async updateDraft(draftData: Partial<ApplicationDraft>): Promise<ApplicationDraft> {
    try {
      const response: AxiosResponse<{ draft: ApplicationDraft }> = await axios.put('/applications/draft', draftData);
      return response.data.draft;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update application draft');
    }
  }

  // Submit application
  async submitApplication(applicationData: Partial<ApplicationSubmission>): Promise<ApplicationSubmission> {
    try {
      const response: AxiosResponse<{ submission: ApplicationSubmission }> = await axios.post('/applications/submit', applicationData);
      return response.data.submission;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit application');
    }
  }

  // Get user's submitted applications
  async getSubmissions(): Promise<ApplicationSubmission[]> {
    try {
      const response: AxiosResponse<{ submissions: ApplicationSubmission[] }> = await axios.get('/applications/submissions');
      return response.data.submissions;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }

  // Get specific submission
  async getSubmission(id: number): Promise<ApplicationSubmission> {
    try {
      const response: AxiosResponse<{ submission: ApplicationSubmission }> = await axios.get(`/applications/submissions/${id}`);
      return response.data.submission;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submission');
    }
  }

  // Add work experience
  async addWorkExperience(workExperience: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>): Promise<WorkExperience> {
    try {
      const response: AxiosResponse<{ work_experience: WorkExperience }> = await axios.post('/applications/work-experiences', workExperience);
      return response.data.work_experience;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add work experience');
    }
  }

  // Update work experience
  async updateWorkExperience(id: number, workExperience: Partial<WorkExperience>): Promise<WorkExperience> {
    try {
      const response: AxiosResponse<{ work_experience: WorkExperience }> = await axios.put(`/applications/work-experiences/${id}`, workExperience);
      return response.data.work_experience;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update work experience');
    }
  }

  // Delete work experience
  async deleteWorkExperience(id: number): Promise<void> {
    try {
      await axios.delete(`/applications/work-experiences/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete work experience');
    }
  }

  // Get user's work experiences
  async getWorkExperiences(): Promise<WorkExperience[]> {
    try {
      const response: AxiosResponse<{ work_experiences: WorkExperience[] }> = await axios.get('/applications/work-experiences');
      return response.data.work_experiences;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch work experiences');
    }
  }

  // Add referee
  async addReferee(referee: Omit<Referee, 'id' | 'created_at' | 'updated_at'>): Promise<Referee> {
    try {
      const response: AxiosResponse<{ referee: Referee }> = await axios.post('/applications/referees', referee);
      return response.data.referee;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add referee');
    }
  }

  // Update referee
  async updateReferee(id: number, referee: Partial<Referee>): Promise<Referee> {
    try {
      const response: AxiosResponse<{ referee: Referee }> = await axios.put(`/applications/referees/${id}`, referee);
      return response.data.referee;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update referee');
    }
  }

  // Delete referee
  async deleteReferee(id: number): Promise<void> {
    try {
      await axios.delete(`/applications/referees/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete referee');
    }
  }

  // Get user's referees
  async getReferees(): Promise<Referee[]> {
    try {
      const response: AxiosResponse<{ referees: Referee[] }> = await axios.get('/applications/referees');
      return response.data.referees;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch referees');
    }
  }

  // Auto-save functionality
  private autoSaveTimeout: NodeJS.Timeout | null = null;

  autoSave(draftData: Partial<ApplicationDraft>, delay: number = 30000): void {
    // Clear existing timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    // Set new timeout
    this.autoSaveTimeout = setTimeout(async () => {
      try {
        await this.updateDraft(draftData);
        console.log('Application auto-saved successfully');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, delay);
  }

  // Cancel auto-save
  cancelAutoSave(): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = null;
    }
  }

  // Calculate completion percentage
  calculateCompletionPercentage(draft: ApplicationDraft): number {
    let completedSteps = 0;
    const totalSteps = 5;

    if (draft.step_1_personal_info && Object.keys(draft.step_1_personal_info).length > 0) {
      completedSteps++;
    }
    if (draft.step_2_education && Object.keys(draft.step_2_education).length > 0) {
      completedSteps++;
    }
    if (draft.step_3_motivation && Object.keys(draft.step_3_motivation).length > 0) {
      completedSteps++;
    }
    if (draft.step_4_special_needs !== undefined) {
      completedSteps++;
    }
    if (draft.step_5_referees && Object.keys(draft.step_5_referees).length > 0) {
      completedSteps++;
    }

    return Math.round((completedSteps / totalSteps) * 100);
  }
}

export default new ApplicationService(); 