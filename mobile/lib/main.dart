import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/task_list_screen.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final token = await ApiService.getToken();

  runApp(CovaTaskManagerApp(isLoggedIn: token != null && token.isNotEmpty));
}

class CovaTaskManagerApp extends StatelessWidget {
  final bool isLoggedIn;

  const CovaTaskManagerApp({Key? key, required this.isLoggedIn}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'COVA Task Manager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.indigo,
        scaffoldBackgroundColor: const Color(0xFF0B0F19),
        fontFamily: 'Roboto',
      ),
      home: isLoggedIn ? const TaskListScreen() : const LoginScreen(),
    );
  }
}
