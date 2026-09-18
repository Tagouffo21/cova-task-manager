import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'task_list_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isRegistering = false;
  bool _isLoading = false;
  String _email = '';
  String _password = '';
  String _fullName = '';
  String? _errorMessage;

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      if (_isRegistering) {
        await ApiService.register(_email.trim(), _password, _fullName.trim());
      } else {
        await ApiService.login(_email.trim(), _password);
      }

      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const TaskListScreen()),
      );
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: const Color(0xFF111827),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.08)),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6366F1).withOpacity(0.15),
                  blurRadius: 30,
                  spreadRadius: 5,
                )
              ],
            ),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // App Icon Header
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.check_box_outlined, color: Colors.white, size: 36),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _isRegistering ? 'Créer un compte' : 'COVA Task Manager',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _isRegistering
                        ? 'Remplissez vos informations ci-dessous'
                        : 'Connectez-vous à votre espace mobile',
                    style: TextStyle(fontSize: 13, color: Colors.grey[400]),
                  ),
                  const SizedBox(height: 24),

                  if (_errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.red.withOpacity(0.3)),
                      ),
                      child: Text(
                        _errorMessage!,
                        style: const TextStyle(color: Colors.redAccent, fontSize: 13),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  if (_isRegistering) ...[
                    TextFormField(
                      style: const TextStyle(color: Colors.white),
                      decoration: _inputDecoration('Nom complet', Icons.person_outline),
                      validator: (val) => val == null || val.isEmpty ? 'Champ obligatoire' : null,
                      onSaved: (val) => _fullName = val ?? '',
                    ),
                    const SizedBox(height: 14),
                  ],

                  TextFormField(
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.emailAddress,
                    decoration: _inputDecoration('Adresse Email', Icons.email_outlined),
                    validator: (val) => val == null || !val.contains('@') ? 'Email invalide' : null,
                    onSaved: (val) => _email = val ?? '',
                  ),
                  const SizedBox(height: 14),

                  TextFormField(
                    style: const TextStyle(color: Colors.white),
                    obscureText: true,
                    decoration: _inputDecoration('Mot de passe', Icons.lock_outline),
                    validator: (val) => val == null || val.length < 6 ? 'Au moins 6 caractères' : null,
                    onSaved: (val) => _password = val ?? '',
                  ),
                  const SizedBox(height: 24),

                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6366F1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: _isLoading ? null : _submit,
                      child: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : Text(
                              _isRegistering ? 'S’INSCRIRE' : 'SE CONNECTER',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                            ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  TextButton(
                    onPressed: () {
                      setState(() {
                        _isRegistering = !_isRegistering;
                        _errorMessage = null;
                      });
                    },
                    child: Text(
                      _isRegistering
                          ? 'Déjà un compte ? Se connecter'
                          : 'Pas de compte ? Créer un compte',
                      style: const TextStyle(color: Color(0xFFA5B4FC)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.grey),
      prefixIcon: Icon(icon, color: Colors.grey),
      filled: true,
      fillColor: const Color(0xFF1F2937),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF6366F1)),
      ),
    );
  }
}
