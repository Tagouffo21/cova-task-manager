import 'package:flutter/material.dart';
import '../models/task.dart';

class AddTaskDialog extends StatefulWidget {
  final TaskItem? editingTask;

  const AddTaskDialog({Key? key, this.editingTask}) : super(key: key);

  @override
  State<AddTaskDialog> createState() => _AddTaskDialogState();
}

class _AddTaskDialogState extends State<AddTaskDialog> {
  final _formKey = GlobalKey<FormState>();
  late String _title;
  String? _description;
  TaskStatus _status = TaskStatus.PENDING;
  TaskPriority _priority = TaskPriority.MEDIUM;

  @override
  void initState() {
    super.initState();
    if (widget.editingTask != null) {
      _title = widget.editingTask!.title;
      _description = widget.editingTask!.description;
      _status = widget.editingTask!.status;
      _priority = widget.editingTask!.priority;
    } else {
      _title = '';
      _description = '';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.editingTask != null;

    return AlertDialog(
      backgroundColor: const Color(0xFF111827),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: Text(
        isEditing ? 'Modifier la Tâche' : 'Nouvelle Tâche',
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                initialValue: _title,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Titre de la tâche',
                  labelStyle: TextStyle(color: Colors.grey),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
                  focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF6366F1))),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Le titre est obligatoire' : null,
                onSaved: (val) => _title = val ?? '',
              ),
              const SizedBox(height: 12),
              TextFormField(
                initialValue: _description,
                style: const TextStyle(color: Colors.white),
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Description (optionnel)',
                  labelStyle: TextStyle(color: Colors.grey),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
                  focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF6366F1))),
                ),
                onSaved: (val) => _description = val,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<TaskStatus>(
                value: _status,
                dropdownColor: const Color(0xFF1F2937),
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Statut',
                  labelStyle: TextStyle(color: Colors.grey),
                ),
                items: const [
                  DropdownMenuItem(value: TaskStatus.PENDING, child: Text('En attente')),
                  DropdownMenuItem(value: TaskStatus.IN_PROGRESS, child: Text('En cours')),
                  DropdownMenuItem(value: TaskStatus.COMPLETED, child: Text('Terminée')),
                ],
                onChanged: (val) => setState(() => _status = val!),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<TaskPriority>(
                value: _priority,
                dropdownColor: const Color(0xFF1F2937),
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Priorité',
                  labelStyle: TextStyle(color: Colors.grey),
                ),
                items: const [
                  DropdownMenuItem(value: TaskPriority.LOW, child: Text('Basse')),
                  DropdownMenuItem(value: TaskPriority.MEDIUM, child: Text('Moyenne')),
                  DropdownMenuItem(value: TaskPriority.HIGH, child: Text('Haute')),
                ],
                onChanged: (val) => setState(() => _priority = val!),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Annuler', style: TextStyle(color: Colors.grey)),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              _formKey.currentState!.save();
              Navigator.of(context).pop({
                'title': _title,
                'description': _description,
                'status': _status,
                'priority': _priority,
              });
            }
          },
          child: Text(isEditing ? 'Enregistrer' : 'Créer', style: const TextStyle(color: Colors.white)),
        ),
      ],
    );
  }
}
