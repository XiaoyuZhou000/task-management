export default class Task {
    constructor(id, title, description, deadline, important = false, completed = false, overDueTime = 0, recurringDaily = false, recurringWeekily = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.important = important;
        this.completed = completed;
        this.overDueTime = overDueTime;
        this.recurringDaily = recurringDaily;
        this.recurringWeekily = recurringWeekily
    }

    static createNew(title, description, deadline, important, recurringDaily, recurringWeekily) {
        return new Task(
        Date.now(),
        title,
        description,
        deadline,
        important,
        false,
        0,
        recurringDaily,
        recurringWeekily
        );
    }

    static fromJSON(json) {
        return new Task(
          json.id,
          json.title,
          json.description,
          json.deadline,
          json.important,
          json.completed,
          json.overDueTime,
          json.recurringDaily,
          json.recurringWeekily
        );
    }
}