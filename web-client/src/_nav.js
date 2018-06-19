export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'Admin',
      url: '/admin',
      icon: 'icon-layers',
      module: 'ADMIN',
      children: [
        {
          name: 'Users',
          url: '/admin/users',
          icon: 'fa fa-group'
        }
      ]
    },
    {
      name: 'Scraping',
      url: '/scraping',
      icon: 'fa fa-database',
      module: 'SCRAPING'
    },
    {
      name: 'API',
      url: '/api',
      icon: 'fa fa-cogs'
    }
  ]
}
