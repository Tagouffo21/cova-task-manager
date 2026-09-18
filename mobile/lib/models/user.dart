class User {
  final int id;
  final String email;
  final String fullName;

  User({
    required this.id,
    required this.email,
    required this.fullName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      email: json['email'] ?? '',
      fullName: json['fullName'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'fullName': fullName,
    };
  }
}
