# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importar
import os
import re

app = Flask(__name__)
CORS(app)

# Carpeta donde se guardarán los correos
EMAIL_DIR = 'emails'

# Crear la carpeta si no existe
if not os.path.exists(EMAIL_DIR):
    os.makedirs(EMAIL_DIR)

@app.route('/send-email', methods=['POST'])
def send_email():
    """
    Recibe el nombre y los correos, genera un HTML de email con la
    plantilla de Iron Play y lo guarda en data-commerce/emails/
    """
    data = request.json
    nombre = data.get('nombre', '').strip()
    emails = data.get('emails', '').strip()

    if not nombre or not emails:
        return jsonify({
            'success': False,
            'message': 'Faltan campos requeridos (nombre o correos).'
        }), 400

    # Sanear el nombre para usarlo en el nombre del archivo
    nombre_limpio = re.sub(r'[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]', '', nombre)
    nombre_archivo = nombre_limpio.replace(' ', '_')
    if not nombre_archivo:
        nombre_archivo = 'destinatario'

    filename = f"correo-para-{nombre_archivo}.html"
    filepath = os.path.join(EMAIL_DIR, filename)

    # Generar el contenido del email con estilos en línea (apto para email)
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marketing Iron Play</title>
</head>
<body style="margin:0;padding:0;background-color:#0b0e1a;font-family:'Segoe UI', system-ui, -apple-system, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0e1a;padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#1a1f2f;border-radius:22px;padding:35px 30px;border:1px solid rgba(255,255,255,0.08);box-shadow:0 12px 40px rgba(108,60,255,0.15);">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:10px;">
              <span style="font-size:52px;color:#a855f7;">⚡</span>
              <h1 style="color:#f0f2fa;font-weight:800;font-size:34px;margin:8px 0 4px;letter-spacing:-0.02em;">IRON PLAY</h1>
              <p style="color:#b0b8d0;font-size:16px;margin:0;">Equipamiento deportivo con estilo futurista</p>
            </td>
          </tr>
          <!-- Separador -->
          <tr>
            <td style="padding:10px 0 20px;">
              <hr style="border:0;height:1px;background:linear-gradient(90deg,transparent,#a855f7,transparent);">
            </td>
          </tr>
          <!-- Mensaje -->
          <tr>
            <td style="color:#f0f2fa;font-size:16px;line-height:1.7;padding:5px 0;">
              <p style="margin:0 0 12px;">Hola <strong style="color:#a855f7;">{nombre}</strong>,</p>
              <p style="margin:0 0 12px;">¡Bienvenido a la comunidad <strong style="color:#f97316;">Iron Play</strong>!</p>
              <p style="margin:0 0 12px;">Descubre las mejores ofertas en equipamiento deportivo de alta calidad. Renueva tu estilo y potencia tu rendimiento con nuestras marcas exclusivas.</p>
              <p style="margin:0 0 12px;">No te pierdas nuestras promociones especiales.</p>
            </td>
          </tr>
          <!-- Botón CTA -->
          <tr>
            <td align="center" style="padding:18px 0 10px;">
              <a href="#" style="display:inline-block;background:linear-gradient(145deg,#f97316,#ec4899);padding:14px 48px;border-radius:60px;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;box-shadow:0 8px 24px rgba(249,115,22,0.3);">Explorar tienda</a>
            </td>
          </tr>
          <!-- Pie -->
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.06);padding-top:22px;text-align:center;color:#b0b8d0;font-size:12px;">
              <p style="margin:0;">© 2026 Iron Play · Todos los derechos reservados.</p>
              <p style="margin:4px 0 0;opacity:0.5;">Este es un correo de marketing.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>"""

    # Guardar el archivo
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error al guardar el archivo: {str(e)}'
        }), 500

    return jsonify({
        'success': True,
        'message': f'Correo enviado exitosamente. Archivo creado: {filename}',
        'file': filename
    })

if __name__ == '__main__':
    print("🚀 Servidor de marketing iniciado en http://localhost:5000")
    print("📁 Los correos se guardarán en data-commerce/emails/")
    app.run(debug=True, port=5000)