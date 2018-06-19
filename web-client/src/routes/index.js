/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
  // Application
  {
    path: '/',
    redirect: '/account',
    name: 'Home',
    component: () => import('../views/layouts/Default'),
    meta: {
      auth: true
    },
    children: [
      {
        path: '/dashboard',
        redirect: '/account',
        name: 'Dashboard',
        component: () => import('../views/pages/Dashboard')
      },
      {
        path: '/account',
        name: 'Account',
        component: () => import('../views/pages/account/profile/page')
      },
      {
        path: '/api',
        name: 'API',
        redirect: '/api/all',
        component: () => import('../views/layouts/router-view'),
        children: [
          {
            path: '/api/all',
            name: 'All',
            component: () => import('../views/pages/api/page')
          },
          {
            path: '/api/icos',
            name: 'ICOs',
            component: () => import('../views/pages/api/icos')
          },
          {
            path: '/api/market',
            name: 'Market',
            component: () => import('../views/pages/api/market')
          },
          {
            path: '/api/social',
            name: 'Social',
            component: () => import('../views/pages/api/social')
          },
          {
            path: '/api/github',
            name: 'Github',
            component: () => import('../views/pages/api/github')
          }
        ]
      },
      {
        path: '/payments',
        name: 'Payments',
        component: () => import('../views/pages/account/payments/page')
      },

      // Scraping ICO panel
      {
        path: '/scraping',
        redirect: '/scraping/icos',
        name: 'Scraping',
        component: () => import('../views/layouts/router-view-fullPath'),
        meta: {
          auth: true,
          module: 'SCRAPING'
        },
        children: [
          {
            path: '/scraping/icos',
            redirect: '/scraping/icos/all',
            name: 'ICOs',
            meta: {
              module: 'SCRAPING'
            },
            component: () => import('../views/layouts/router-view-fullPath'),
            children: [
              {
                path: '/scraping/icos/all',
                name: 'All',
                meta: {
                  module: 'SCRAPING'
                },
                component: () => import('../views/pages/scraping/ICOs/search-page')
              },
              {
                path: '/scraping/icos/new',
                name: 'New',
                meta: {
                  module: 'SCRAPING'
                },
                component: () => import('../views/pages/scraping/ICOs/new-page')
              },
              {
                path: '/scraping/icos/:id/edit',
                name: 'Edit',
                meta: {
                  module: 'SCRAPING'
                },
                component: () => import('../views/pages/scraping/ICOs/edit-page')
              }
            ]
          }
        ]
      }
    ]
  },

  // Admin panel
  {
    path: '/admin',
    redirect: '/admin/users',
    name: 'Admin',
    component: () => import('../views/layouts/Default'),
    meta: {
      auth: true,
      module: 'ADMIN'
    },
    children: [
      {
        path: '/admin/users',
        name: 'Users',
        redirect: '/admin/users/',
        meta: {
          module: 'ADMIN'
        },
        component: () => import('../views/layouts/router-view'),
        children: [
          {
            path: '/admin/users/',
            name: 'All',
            meta: {
              module: 'ADMIN'
            },
            component: () => import('../views/pages/admin/users/users-all')
          },
          {
            path: '/admin/users/:id',
            name: 'Profile',
            meta: {
              module: 'ADMIN'
            },
            component: () => import('../views/pages/admin/users/user-profile')
          }
        ]
      }
    ]
  },

  // Login
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/pages/Login'),
    meta: {
      guest: true
    }
  },

  // Register
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/pages/Register'),
    meta: {
      guest: true
    }
  },

  // Reset password
  {
    path: '/reset',
    name: 'Reset',
    component: () => import('../views/pages/Reset'),
    meta: {
      guest: true
    }
  },

  // Recovery - call API and redirect to dashboard
  {
    path: '/recovery',
    component: () => import('../views/pages/Recovery'),
    meta: {
      guest: true
    }
  },

  // Confirm email - call API and redirect to dashboard
  {
    path: '/confirm',
    meta: {
      confirm: true
    }
  },

  // Logout
  {
    path: '/logout',
    meta: {
      logout: true
    }
  },

  // Handle 404
  {
    path: '*',
    name: 'error404',
    component: () => import('../views/pages/Page404')
  },

  // Handle 500
  {
    path: '/500',
    name: 'error500',
    component: () => import('../views/pages/Page500')
  }
];
