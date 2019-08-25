export default interface ICourseActivity {
  externalIdentifier: string;
  itemIdentifier: string;
  resourceIdentifier: string;
  activityType: string;
  href: string;
  scaledPassingScore: string;
  title: string;
  children: any[];
}
