<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Passport Guard
    |--------------------------------------------------------------------------
    |
    | Here you may specify which authentication guard Passport will use when
    | authenticating users. This value should correspond with one of your
    | guards that is already present in your auth configuration file.
    |
    */

    'guard' => 'web',

    /*
    |--------------------------------------------------------------------------
    | Passport Passwords
    |--------------------------------------------------------------------------
    |
    | Here you may specify which password broker that Passport will use when
    | attempting to verify the given token for password resets. This value
    | should correspond with one of your password brokers that is already
    | present in your auth configuration file.
    |
    */

    'passwords' => 'users',

    /*
    |--------------------------------------------------------------------------
    | Passport Path
    |--------------------------------------------------------------------------
    |
    | This is the base URI path where Passport's routes will be available
    | from. Feel free to tweak this path according to your preferences and
    | application design. Passport will use this when generating its routes.
    |
    */

    'path' => env('PASSPORT_PATH', 'oauth'),

    /*
    |--------------------------------------------------------------------------
    | Passport Routes Prefix
    |--------------------------------------------------------------------------
    |
    | This value will be used to prefix all of the Passport routes when they
    | are registered with the router. You can change this value if you need
    | to avoid route conflicts with other parts of your application.
    |
    */

    'prefix' => env('PASSPORT_PREFIX', 'oauth'),

    /*
    |--------------------------------------------------------------------------
    | Passport Token Expiration
    |--------------------------------------------------------------------------
    |
    | Here you can configure the number of minutes that access tokens will
    | remain valid. You may also set the expiration for refresh tokens.
    |
    */

    'tokens' => [
        'access_token_expire_in' => env('PASSPORT_ACCESS_TOKEN_EXPIRE_IN', 1800), // 30 minutes
        'refresh_token_expire_in' => env('PASSPORT_REFRESH_TOKEN_EXPIRE_IN', 86400), // 24 hours
    ],

    /*
    |--------------------------------------------------------------------------
    | Passport Client UUIDs
    |--------------------------------------------------------------------------
    |
    | By default, Passport uses auto-incrementing primary keys when assigning
    | IDs to clients. However, if Passport is installed using the provided
    | --uuids switch, this will be set to "true" and UUIDs will be used.
    |
    */

    'client_uuids' => false,

    /*
    |--------------------------------------------------------------------------
    | Passport Personal Access Clients
    |--------------------------------------------------------------------------
    |
    | Here you can specify which of your applications' personal access clients
    | will be used when issuing personal access tokens. Passport will use this
    | when generating tokens via the "createToken" method on your user model.
    |
    */

    'personal_access_client' => [
        'id' => env('PASSPORT_PERSONAL_ACCESS_CLIENT_ID'),
        'secret' => env('PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Passport Storage Driver
    |--------------------------------------------------------------------------
    |
    | This configuration value allows you to customize the storage options
    | for Passport, such as the database connection that should be used
    | by Passport's internal database models which store tokens, etc.
    |
    */

    'storage' => [
        'database' => [
            'connection' => env('DB_CONNECTION', 'mysql'),
        ],
    ],

]; 