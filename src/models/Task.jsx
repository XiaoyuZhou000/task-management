export default class Task {
    constructor(id, title, description, deadline, important = false, completed = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.important = important;
        this.completed = completed;
    }

    static createNew(title, description, deadline, important) {
        return new Task(
        Date.now(),
        title,
        description,
        deadline,
        important
        );
    }

    static fromJSON(json) {
        return new Task(
          json.id,
          json.title,
          json.description,
          json.deadline,
          json.important,
          json.completed
        );
    }
}