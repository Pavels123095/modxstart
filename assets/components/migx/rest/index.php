<?php
// Boot up MODX
$working_context = 'web';

require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
require_once MODX_CORE_PATH . 'model/modx/modx.class.php';
$modx = new modX();
$modx->initialize($working_context);
$modx->getService('error','error.modError', '', '');
// Boot up any service classes or packages (models) you will need

$migxCorePath = realpath($modx->getOption('migx.core_path', null, $modx->getOption('core_path') . 'components/migx')) . '/';
$migx = $modx->getService('migx', 'Migx', $migxCorePath . 'model/migx/');

$migx->config['configs'] = isset($_REQUEST['configs']) ? $_REQUEST['configs'] : '';
//$migx->config['tvname'] = isset($_REQUEST['tv_name']) ? $_REQUEST['tv_name'] : ''; 
$migx->loadConfigs();

$packageCorePath = $migxCorePath;
/*
$packageCorePath = realpath($modx->getOption('fbuch.core_path', null, $modx->getOption('core_path') . 'components/fbuch')) . '/';
$fbuch = $modx->getService('fbuch', 'Fbuch', $packageCorePath . 'model/fbuch/');
*/

// Load the modRestService class and pass it some basic configuration
$rest = $modx->getService('rest', 'rest.modRestService', '', array(
    'basePath' => $packageCorePath . 'rest/Controllers/',
    'controllerClassSeparator' => '',
    'controllerClassPrefix' => 'MyController',
    'xmlRootNode' => 'response',
));

//print_r($modx->user->toArray());

// Prepare the request
$rest->prepare();
// Make sure the user has the proper permissions, send the user a 401 error if not
if (!$rest->checkPermissions()) {
    $rest->sendUnauthorized(true);
}
// Run the request
$rest->process();