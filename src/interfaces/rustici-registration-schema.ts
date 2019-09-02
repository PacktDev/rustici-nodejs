export default interface IRegistrationSchema {
  courseId: string,
  learner: {
    id: string,
    firstName: string,
    lastName: string
  },
  registrationId: string
}
