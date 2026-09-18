import 'package:flutter/material.dart';
import '../models/task.dart';
import '../services/api_service.dart';
import '../widgets/add_task_dialog.dart';
import 'login_screen.dart';

class TaskListScreen extends StatefulWidget {
  const TaskListScreen({Key? key}) : super(key: key);

  @override
  State<TaskListScreen> createState() => _TaskListScreenState();
}

class _TaskListScreenState extends State<TaskListScreen> {
  List<TaskItem> _tasks = [];
  bool _isLoading = true;
  TaskStatus? _selectedStatus;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    setState(() => _isLoading = true);
    try {
      final list = await ApiService.getTasks(
        status: _selectedStatus,
        search: _searchQuery,
      );
      setState(() {
        _tasks = list;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _logout() async {
    await ApiService.removeToken();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  void _openAddTaskDialog([TaskItem? editingTask]) async {
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => AddTaskDialog(editingTask: editingTask),
    );

    if (result != null) {
      try {
        if (editingTask != null) {
          await ApiService.updateTask(
            editingTask.id,
            result['title'],
            result['description'],
            result['status'],
            result['priority'],
          );
        } else {
          await ApiService.createTask(
            result['title'],
            result['description'],
            result['status'],
            result['priority'],
          );
        }
        _loadTasks();
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Échec: ${e.toString()}')),
          );
        }
      }
    }
  }

  void _deleteTask(int id) async {
    try {
      await ApiService.deleteTask(id);
      _loadTasks();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Échec de la suppression: $e')),
        );
      }
    }
  }

  Widget _buildStatusChip(String label, TaskStatus? status) {
    final isSelected = _selectedStatus == status;
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        selectedColor: const Color(0xFF6366F1),
        backgroundColor: const Color(0xFF1F2937),
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : Colors.grey[300],
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        onSelected: (bool selected) {
          setState(() {
            _selectedStatus = selected ? status : null;
          });
          _loadTasks();
        },
      ),
    );
  }

  Color _getStatusColor(TaskStatus status) {
    switch (status) {
      case TaskStatus.COMPLETED:
        return const Color(0xFF34D399);
      case TaskStatus.IN_PROGRESS:
        return const Color(0xFF38BDF8);
      default:
        return const Color(0xFFFBBF24);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: const Text('COVA Task Manager', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadTasks,
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.redAccent),
            onPressed: _logout,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filters Header
          Container(
            padding: const EdgeInsets.all(16.0),
            color: const Color(0xFF111827),
            child: Column(
              children: [
                TextField(
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Rechercher une tâche...',
                    hintStyle: const TextStyle(color: Colors.grey),
                    prefixIcon: const Icon(Icons.search, color: Colors.grey),
                    filled: true,
                    fillColor: const Color(0xFF1F2937),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onChanged: (val) {
                    _searchQuery = val;
                    _loadTasks();
                  },
                ),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildStatusChip('Toutes', null),
                      _buildStatusChip('En attente', TaskStatus.PENDING),
                      _buildStatusChip('En cours', TaskStatus.IN_PROGRESS),
                      _buildStatusChip('Terminées', TaskStatus.COMPLETED),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Task List Body
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1)))
                : _tasks.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.inbox, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text('Aucune tâche trouvée', style: TextStyle(color: Colors.grey, fontSize: 16)),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadTasks,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _tasks.length,
                          itemBuilder: (ctx, idx) {
                            final task = _tasks[idx];
                            return Card(
                              color: const Color(0xFF111827),
                              margin: const EdgeInsets.only(bottom: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                                side: BorderSide(color: Colors.white.withOpacity(0.08)),
                              ),
                              child: ListTile(
                                leading: CircleAvatar(
                                  radius: 12,
                                  backgroundColor: _getStatusColor(task.status).withOpacity(0.2),
                                  child: CircleAvatar(
                                    radius: 6,
                                    backgroundColor: _getStatusColor(task.status),
                                  ),
                                ),
                                title: Text(
                                  task.title,
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    decoration: task.status == TaskStatus.COMPLETED
                                        ? TextDecoration.lineThrough
                                        : null,
                                  ),
                                ),
                                subtitle: task.description != null && task.description!.isNotEmpty
                                    ? Text(
                                        task.description!,
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(color: Colors.grey, fontSize: 12),
                                      )
                                    : null,
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit_outlined, color: Colors.indigoAccent, size: 20),
                                      onPressed: () => _openAddTaskDialog(task),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                                      onPressed: () => _deleteTask(task.id),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF6366F1),
        onPressed: () => _openAddTaskDialog(),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('NOUVELLE TÂCHE', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }
}
