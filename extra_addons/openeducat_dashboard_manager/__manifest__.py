{
    'name': 'OpenEduCat Dashboard Manager',
    'version': '18.0.1.0.0',
    'category': 'Education',
    'summary': 'Manage announcements and notices for the Parent Portal',
    'description': """
        Backend module to manage dynamic content for the Parent Portal:
        - Announcements (Carousel images and titles)
        - Notices (Scrolling ticker text)
    """,
    'depends': ['base', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/dashboard_content_view.xml',
    ],
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
