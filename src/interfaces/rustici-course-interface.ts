import ICourseActivity from './rustici-course-activity-interface';
import ICourseMetadata from './rustici-course-metadata-interface';

export default interface ICourse {
  id: string;
  title: string;
  xapiActivityId: string;
  updated: Date;
  webPath: string;
  version: number;
  registrationCount: number;
  activityId: string;
  courseLearningStandard: string;
  metadata: ICourseMetadata;
  rootActivity: ICourseActivity;
}
