(function() {
	'use strict';
	angular
		.module('core.constant', [])		
		.constant('USER_GROUPS', [
                 {
                    name:"Executive",
                    code:"executive"
                 },
                 {
                    name:"Vice President",
                    code:"vp"
                 },
                 {
                    name:"Manager",
                    code:"manager"
                 },
                 {
                    name:"Team Lead",
                    code:"tl"
                 },
                 {
                    name:"Staff",
                    code:"staff"
                 }
          ])
}).call(this);