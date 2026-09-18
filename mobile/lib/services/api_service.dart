import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/task.dart';

class ApiService {
  // Détection automatique : http://localhost:8080 pour Web/Chrome/Desktop et http://10.0.2.2:8080 pour Émulateur Android
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8080/api';
    }
    return 'http://10.0.2.2:8080/api';
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  static Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
  }

  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }

  static Future<Map<String, String>> _getHeaders() async {
    final token = await getToken();
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // AUTH
  static Future<Map<String, dynamic>> register(String email, String password, String fullName) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'fullName': fullName,
      }),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['token'] != null) {
        await setToken(data['token']);
      }
      return data;
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['message'] ?? 'Échec de l’inscription');
    }
  }

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['token'] != null) {
        await setToken(data['token']);
      }
      return data;
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['message'] ?? 'Échec de la connexion');
    }
  }

  // TASKS
  static Future<List<TaskItem>> getTasks({TaskStatus? status, String? search}) async {
    final headers = await _getHeaders();
    final queryParams = <String, String>{};
    if (status != null) {
      queryParams['status'] = TaskItem.statusToString(status);
    }
    if (search != null && search.isNotEmpty) {
      queryParams['search'] = search;
    }

    final uri = Uri.parse('$baseUrl/tasks').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: headers);

    if (response.statusCode == 200) {
      final List<dynamic> list = jsonDecode(response.body);
      return list.map((item) => TaskItem.fromJson(item)).toList();
    } else {
      throw Exception('Erreur lors de la récupération des tâches');
    }
  }

  static Future<TaskItem> createTask(String title, String? description, TaskStatus status, TaskPriority priority) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/tasks'),
      headers: headers,
      body: jsonEncode({
        'title': title,
        'description': description,
        'status': TaskItem.statusToString(status),
        'priority': priority.name,
      }),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      return TaskItem.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Erreur lors de la création de la tâche');
    }
  }

  static Future<TaskItem> updateTask(int id, String title, String? description, TaskStatus status, TaskPriority priority) async {
    final headers = await _getHeaders();
    final response = await http.put(
      Uri.parse('$baseUrl/tasks/$id'),
      headers: headers,
      body: jsonEncode({
        'title': title,
        'description': description,
        'status': TaskItem.statusToString(status),
        'priority': priority.name,
      }),
    );

    if (response.statusCode == 200) {
      return TaskItem.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Erreur lors de la mise à jour');
    }
  }

  static Future<void> deleteTask(int id) async {
    final headers = await _getHeaders();
    final response = await http.delete(
      Uri.parse('$baseUrl/tasks/$id'),
      headers: headers,
    );

    if (response.statusCode != 204 && response.statusCode != 200) {
      throw Exception('Erreur lors de la suppression');
    }
  }
}
