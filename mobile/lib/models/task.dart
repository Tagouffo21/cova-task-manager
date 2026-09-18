enum TaskStatus { PENDING, IN_PROGRESS, COMPLETED }
enum TaskPriority { LOW, MEDIUM, HIGH }

class TaskItem {
  final int id;
  final String title;
  final String? description;
  final TaskStatus status;
  final TaskPriority priority;
  final String? dueDate;
  final int userId;

  TaskItem({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    required this.priority,
    this.dueDate,
    required this.userId,
  });

  factory TaskItem.fromJson(Map<String, dynamic> json) {
    return TaskItem(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      title: json['title'] ?? '',
      description: json['description'],
      status: parseStatus(json['status']),
      priority: parsePriority(json['priority']),
      dueDate: json['dueDate'],
      userId: json['userId'] is int ? json['userId'] : int.parse(json['userId'].toString()),
    );
  }

  static TaskStatus parseStatus(String? str) {
    switch (str) {
      case 'IN_PROGRESS':
        return TaskStatus.IN_PROGRESS;
      case 'COMPLETED':
        return TaskStatus.COMPLETED;
      default:
        return TaskStatus.PENDING;
    }
  }

  static String statusToString(TaskStatus status) {
    switch (status) {
      case TaskStatus.IN_PROGRESS:
        return 'IN_PROGRESS';
      case TaskStatus.COMPLETED:
        return 'COMPLETED';
      default:
        return 'PENDING';
    }
  }

  static TaskPriority parsePriority(String? str) {
    switch (str) {
      case 'HIGH':
        return TaskPriority.HIGH;
      case 'LOW':
        return TaskPriority.LOW;
      default:
        return TaskPriority.MEDIUM;
    }
  }
}
