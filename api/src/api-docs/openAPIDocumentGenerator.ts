import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/modules/healthCheck/healthCheck.router";
import { authRegister } from "@/modules/auth/auth.router";
import { productRegistry } from "@/modules/product/product.router";
import { categoryRegistry } from "@/modules/category/category.route";
import { plasticRegistry } from "@/modules/plastic/plastic.router";

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([healthCheckRegistry, authRegister, productRegistry, categoryRegistry, plasticRegistry]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "PlastiApp API",
		},
	});
}
